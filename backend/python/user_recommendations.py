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
        known_indices = [event_id_to_index[eid] for eid in known_ids if eid in event_id_to_index]

        if not known_indices:
            continue

        user_profile = event_tfidf[known_indices].mean(axis=0)
        user_profile_array = np.asarray(user_profile)
        similarity = cosine_similarity(user_profile_array, event_tfidf).flatten()

        for idx in known_indices:
            similarity[idx] = -1

        top_indices = similarity.argsort()[-10:][::-1]
        recommended_event_ids = [event_ids[i] for i in top_indices]

        db.users.update_one({"_id": user_id}, {"$set": {"recomendation": recommended_event_ids}})
        updated_users += 1

    print(f"Recomendaciones de usuario actualizadas para {updated_users} usuarios.")

if __name__ == "__main__":
    get_user_profile_recommendations()
