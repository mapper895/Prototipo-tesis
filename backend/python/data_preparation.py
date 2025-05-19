from dotenv import load_dotenv
import os
from pymongo import MongoClient

# Carga el archivo .env
load_dotenv()

# Obtiene la URI desde la variable de entorno
MONGO_URI = os.getenv("MONGO_URI")

def conectar_mongo():
    client = MongoClient(MONGO_URI)
    db = client["tesis_db"]  # usa el nombre correcto de tu base
    return db

def cargar_usuarios(db):
    usuarios = list(db.users.find({}, {
        "_id": 1,
        "preferences": 1,
        "likedEvents": 1
    }))
    return usuarios

def cargar_eventos(db):
    eventos = list(db.events.find({}, {
        "_id": 1,
        "category": 1,
        "title": 1,
        "description": 1,
        "location": 1
    }))
    return eventos

def preparar_texto_eventos(eventos):
    for evento in eventos:
        texto = " ".join([
            evento.get("category", ""),
            evento.get("title", ""),
            evento.get("description", ""),
            evento.get("location", "")
        ])
        evento["texto_combinado"] = texto.lower()
    return eventos

if __name__ == "__main__":
    db = conectar_mongo()
    usuarios = cargar_usuarios(db)
    eventos = cargar_eventos(db)
    eventos = preparar_texto_eventos(eventos)

    print(f"Usuarios cargados: {len(usuarios)}")
    print(f"Eventos cargados: {len(eventos)}")
    print(f"Ejemplo texto combinado evento:\n{eventos[0]['texto_combinado']}")
