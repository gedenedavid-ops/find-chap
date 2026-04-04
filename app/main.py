import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import upload, search, detect

app = FastAPI(title="FindChap API", version="1.0")

# Configuration CORS dynamique pour la production
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(detect.router, prefix="/api", tags=["detect"])
app.include_router(search.router, prefix="/api", tags=["search"])

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "FindChap v1.2"}

# Servir le Frontend React (Fichiers statiques générés par le build)
# Note : À placer APRÈS les routes d'API pour ne pas les masquer.
# Pour le développement local, on vérifie si le dossier 'dist' existe.
if os.path.exists("dist"):
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory="dist", html=True), name="static")

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API de FindChap 🚀"}
