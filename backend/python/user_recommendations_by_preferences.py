import sys
import os
from pymongo import MongoClient
from bson import ObjectId
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
        except Exception:
            continue
    return False

def filter_future_events(events):
    return [e for e in events if event_has_future_date(e.get("dates", []))]

def get_user_recommendations_by_preferences(user_id):
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db = client["tesis_db"]

    # Obtener todos los eventos
    all_events = list(db.events.find({}))
    events = filter_future_events(all_events)
    if not events:
        print("No hay eventos futuros.")
        return

    event_ids = [e["_id"] for e in events]
    texts = [f"{e.get('title','')} {e.get('description','')} {e.get('category','')}" for e in events]

    # Vectorizador TF-IDF para eventos
    vectorizer = TfidfVectorizer(stop_words="english")
    event_tfidf = vectorizer.fit_transform(texts)
    event_id_to_index = {eid: idx for idx, eid in enumerate(event_ids)}

    try:
        user_obj_id = ObjectId(user_id)
    except Exception as e:
        print(f"Error al convertir user_id a ObjectId: {e}")
        return

    user = db.users.find_one({"_id": user_obj_id})
    if not user:
        print(f"Usuario con id {user_id} no encontrado.")
        return

    preferences = set(user.get("preferences", []))
    if not preferences:
        print(f"El usuario con id {user_id} no tiene preferencias.")
        return

    preferences_text = " ".join(preferences)
    preferences_vec = vectorizer.transform([preferences_text])

    similarity = cosine_similarity(preferences_vec, event_tfidf).flatten()

    top_indices = similarity.argsort()[-10:][::-1]
    recommended_event_ids = [event_ids[i] for i in top_indices]

    db.users.update_one({"_id": user_obj_id}, {"$set": {"recomendation": recommended_event_ids}})

    print(f"Recomendaciones generadas para el usuario {user_id} basadas en sus preferencias.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: userId no proporcionado")
        sys.exit(1)
    user_id = sys.argv[1]
    get_user_recommendations_by_preferences(user_id)
