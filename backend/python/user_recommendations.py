from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from datetime import datetime
import os

def event_has_future_date(event_dates):
    today = datetime.utcnow().date()
    for date_str in event_dates:
        try:
            event_date = datetime.strptime(date_str, "%d/%m/%Y").date()
            if event_date >= today:
                return True
        except Exception:
            continue
    return False

def filter_future_events(events):
    return [e for e in events if event_has_future_date(e.get("dates", []))]

# Modelo basado en perfil de usuario (TF-IDF de contenido)
def get_user_profile_recommendations():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db = client["tesis_db"]

    all_events = list(db.events.find({}))
    events = filter_future_events(all_events)
    if not events:
        print("No hay eventos futuros.")
        return

    event_ids = [e["_id"] for e in events]
    texts = [f"{e.get('title','')} {e.get('description','')} {e.get('category','')}" for e in events]

    vectorizer = TfidfVectorizer(stop_words="english")
    event_tfidf = vectorizer.fit_transform(texts)
    event_id_to_index = {eid: idx for idx, eid in enumerate(event_ids)}

    users = list(db.users.find({}))
    reservations = list(db.reservations.find({}))

    updated_users = 0
    for user in users:
        user_id = user["_id"]
        liked_ids = user.get("likedEvents", [])
        reserved_ids = [r["eventId"] for r in reservations if r["userId"] == user_id]
        known_ids = set(liked_ids) | set(reserved_ids)

        #Agregamos las preferencias del usuario
        preferences = set(user.get("preferences", [])) #Preferencias como categorias
        known_ids = known_ids | preferences #Unimos las preferencias a los eventos conocidos

        # Aquí agregamos el historial de búsqueda concatenado en un solo string
        search_history_text = " ".join(user.get("searchHistory", []))

        known_indices = [event_id_to_index[eid] for eid in known_ids if eid in event_id_to_index]

        if not known_indices and not search_history_text:
            # Si no hay eventos ni historial de búsqueda, saltamos usuario
            continue

        # Construir perfil textual basado en eventos conocidos
        if known_indices:
            user_profile_events = event_tfidf[known_indices].mean(axis=0)
        else:
            # Si no tiene eventos conocidos, perfil vacío
            user_profile_events = np.zeros((1, event_tfidf.shape[1]))

        # Vectorizar el texto de búsqueda del usuario con el mismo vectorizer
        if search_history_text:
            search_vec = vectorizer.transform([search_history_text])
        else:
            search_vec = np.zeros((1, event_tfidf.shape[1]))

        # Si el usuario tiene preferencias, tratarlas como un conjunto de categorias
        if preferences:
            #Convertimos las preferencias en un perfil basado en categorias usando el vectorizer
            preferences_text = " ".join(preferences)
            preferences_vec = vectorizer.transform([preferences_text])
        else:
            preferences_vec = np.zeros((1, event_tfidf.shape[1]))

        # Combinar perfil eventos y búsqueda (ponderación 70%-30% por ejemplo)
        user_profile = (0.5 * user_profile_events + 0.3 * search_vec + 0.2 * preferences_vec)
        user_profile_array = np.asarray(user_profile)

        similarity = cosine_similarity(user_profile_array, event_tfidf).flatten()

        # Excluir eventos que ya conoce
        for idx in known_indices:
            similarity[idx] = -1

        top_indices = similarity.argsort()[-10:][::-1]
        recommended_event_ids = [event_ids[i] for i in top_indices]

        db.users.update_one({"_id": user_id}, {"$set": {"recomendation": recommended_event_ids}})
        updated_users += 1

    print(f"Recomendaciones de usuario actualizadas para {updated_users} usuarios.")

if __name__ == "__main__":
    get_user_profile_recommendations()
