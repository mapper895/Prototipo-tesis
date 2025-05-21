import os
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from datetime import datetime

def event_has_future_date(event_dates):
    today = datetime.utcnow().date()
    for date_str in event_dates:
        try:
            event_date = datetime.strptime(date_str, "%d/%m/%Y").date()
            if event_date >= today:
                return True
        except ValueError:
            continue
    return False

def main():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db = client["tesis_db"]

    # Cargar todos los eventos
    all_events = list(db.events.find({}))

    # Filtrar solo eventos con fechas futuras
    events = [e for e in all_events if event_has_future_date(e.get("dates", []))]
    if not events:
        print("No hay eventos futuros en la base.")
        return

    event_ids = []
    event_texts = []
    for e in events:
        event_ids.append(e["_id"])
        text = f"{e.get('title', '')} {e.get('description', '')} {e.get('category', '')}"
        event_texts.append(text)

    # Vectorizar textos de eventos futuros
    vectorizer = TfidfVectorizer(stop_words="english")
    event_tfidf = vectorizer.fit_transform(event_texts)

    event_id_to_index = {eid: idx for idx, eid in enumerate(event_ids)}

    # === Calcular eventos similares ===
    similarity_matrix = cosine_similarity(event_tfidf)
    for idx, event_id in enumerate(event_ids):
        similarity_scores = list(enumerate(similarity_matrix[idx]))
        similarity_scores = [x for x in similarity_scores if x[0] != idx]
        similarity_scores.sort(key=lambda x: x[1], reverse=True)
        top_similar = similarity_scores[:5]
        similar_event_ids = [event_ids[i[0]] for i in top_similar]
        db.events.update_one(
            {"_id": event_id},
            {"$set": {"similarEvents": similar_event_ids}}
        )
    print("Recomendaciones de eventos similares actualizadas.")

    # Cargar usuarios
    users = list(db.users.find({}))
    if not users:
        print("No hay usuarios en la base.")
        return

    # Cargar reservas
    reservations = list(db.reservations.find({}))

    # === Recomendar eventos a usuarios ===
    for user in users:
        user_id = user["_id"]

        liked_event_ids = user.get("likedEvents", [])
        reserved_event_ids = [r["eventId"] for r in reservations if r["userId"] == user_id]

        known_event_ids = set(liked_event_ids) | set(reserved_event_ids)
        known_indices = [event_id_to_index[eid] for eid in known_event_ids if eid in event_id_to_index]

        if not known_indices:
            print(f"Usuario {user_id} no tiene likes ni reservas en eventos futuros, saltando...")
            continue

        user_profile = event_tfidf[known_indices].mean(axis=0)
        user_profile_array = np.asarray(user_profile)

        similarity = cosine_similarity(user_profile_array, event_tfidf).flatten()

        for idx in known_indices:
            similarity[idx] = -1

        top_indices = similarity.argsort()[-5:][::-1]
        recommended_event_ids = [event_ids[i] for i in top_indices]

        db.users.update_one({"_id": user_id}, {"$set": {"recomendation": recommended_event_ids}})

        print(f"Usuario {user_id} recomendado eventos: {recommended_event_ids}")

    print("Recomendaciones para usuarios actualizadas.")

if __name__ == "__main__":
    main()
