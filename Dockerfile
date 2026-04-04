# --- STAGE 1: Build Frontend ---
FROM node:20-slim AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- STAGE 2: Run Backend + Serve Frontend ---
FROM python:3.12-slim
WORKDIR /app

# Dépendances système (pour pandas/pdfplumber si nécessaire)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du Backend
COPY app/ ./app/

# Copie du Frontend buildé depuis l'étape précédente
COPY --from=build-stage /app/dist ./dist

# Exposition du port (Koyeb utilise souvent 8000 par défaut)
EXPOSE 8000

# Commande de lancement (Uvicorn)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
