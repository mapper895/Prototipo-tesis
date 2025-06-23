# Usa una imagen base de Python
FROM python:3.9-slim

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    chromium \
    chromium-driver \
    ca-certificates \
    lsb-release \
    git \
    build-essential \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Instalar Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs

# Establecer directorio de trabajo
WORKDIR /app

# Copiar todo el proyecto
COPY . .

# Crear entorno virtual e instalar dependencias de Python
RUN python3 -m venv /app/venv \
    && /app/venv/bin/pip install --upgrade pip \
    && /app/venv/bin/pip install -r requirements.txt

# Instalar dependencias JS + construir frontend
RUN npm run build

# Exponer el puerto del backend
EXPOSE 5000

# Ejecutar el backend
CMD ["sh", "-c", ". /app/venv/bin/activate && npm run start"]
