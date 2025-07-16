
# 🎭 Plataforma MERN de Gestión de Eventos Culturales

Aplicación web integral que promueve eventos culturales en la Ciudad de México dirigidos a jóvenes de 18 a 24 años. Usa scraping, inteligencia artificial y automatización para incrementar la visibilidad de estos eventos.
Puedes acceder a la versión desplegada aquí:  
🔗 [https://tesis-app-7sij.onrender.com/](https://tesis-app-7sij.onrender.com/)

## 🚀 Tecnologías Utilizadas

- **Frontend:** React + Vite, TailwindCSS, Zustand, React Router
- **Backend:** Node.js, Express, Mongoose
- **Base de Datos:** MongoDB Atlas
- **Inteligencia Artificial:** Python (TF-IDF, Scikit-learn)
- **Scraping:** Selenium + BeautifulSoup
- **Despliegue:** Docker + Render

## ⚙️ Instalación Local

1. Clona el repositorio:
```bash
git clone <repo_url>
cd <repo>
```

2. Configura variables de entorno:
MONGO_URI=MONGO_URI
PORT=PORT
JWT_SECRET=JWT_KEY
NODE_ENV=development
GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY
GOOGLE_MAPS_MAP_ID=GOOGLE_MAPS_MAP_ID
GMAIL_EMAIL_USER=GMAIL_EMAIL_USER
GMAIL_EMAIL_PASS=GMAIL_EMAIL_PASS

3. Instala dependencias:
```bash
cd frontend && npm install
cd ../backend && npm install
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

## 🧠 Sistema de Recomendación

- Recomendaciones personalizadas usando TF-IDF
- Considera eventos gustados, historial de búsqueda y preferencias
- Actualiza automáticamente el campo `recomendation` en cada usuario
- Ejecutado periódicamente con `cron` y Python

## 🔍 Web Scraping

- Fuente: [https://cartelera.cdmx.gob.mx/](https://cartelera.cdmx.gob.mx/)
- Extracción automatizada de: nombre, descripción, fechas, horarios, costos, ubicación, etc.
- Se ejecuta semanalmente, guarda los eventos en `.json` y los sube a MongoDB si son nuevos

## 🗃️ Modelos Principales

- `User`: preferencias, historial, eventos gustados
- `Event`: descripción, fechas, horarios, ubicación, likes, relacionados
- `Reservation`, `Feedback`, `Notification`

## 📆 Tareas Programadas

Automatización con `node-cron`:
- 🔁 Recomendaciones cada 3 días
- 📬 Envío de eventos destacados (jueves)
- ⏰ Recordatorios para eventos del día siguiente
- 🧹 Scraping + actualización semanal
- 📣 Publicación de eventos en redes sociales

## 🤝 Contribuciones

¡Contribuciones bienvenidas! Si encuentras errores o quieres proponer mejoras, abre un issue o pull request.

---

© 2025 Miguel Pérez. Proyecto académico/documental con fines culturales y educativos.
