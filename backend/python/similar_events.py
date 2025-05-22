from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
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

def get_similar_events():
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
    tfidf_matrix = vectorizer.fit_transform(texts)

    similarity_matrix = cosine_similarity(tfidf_matrix)

    similar_events_map = {}
    for idx, eid in enumerate(event_ids):
        sim_scores = list(enumerate(similarity_matrix[idx]))
        sim_scores = [x for x in sim_scores if x[0] != idx]
        sim_scores.sort(key=lambda x: x[1], reverse=True)
        top_similar = sim_scores[:5]
        similar_events_map[eid] = [event_ids[i[0]] for i in top_similar]

    for eid, similar_ids in similar_events_map.items():
        db.events.update_one({"_id": eid}, {"$set": {"similarEvents": similar_ids}})

    print(f"Eventos similares actualizados para {len(similar_events_map)} eventos.")

if __name__ == "__main__":
    get_similar_events()
