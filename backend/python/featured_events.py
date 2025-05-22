from pymongo import MongoClient
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

def get_featured_events(top_n=10):
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db = client["tesis_db"]

    all_events = list(db.events.find({}))
    events = filter_future_events(all_events)

    if not events:
        print("No hay eventos futuros.")
        return

    # Ordenar por likesCount y views (puedes ajustar el criterio)
    sorted_events = sorted(events, key=lambda e: (e.get("likesCount", 0), e.get("views", 0)), reverse=True)
    featured = sorted_events[:top_n]

    print(f"Top {top_n} eventos destacados obtenidos.")

    # Si quieres guardar en BD o solo mostrar, aquí solo imprime
    # Si quieres guardar, puedes agregar actualización en DB

    for ev in featured:
        print(f"{ev.get('title', 'Sin título')} - Likes: {ev.get('likesCount',0)}, Views: {ev.get('views',0)}")

if __name__ == "__main__":
    get_featured_events()
