from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.parser import FileParser, get_columns
import uuid

router = APIRouter()

# Dictionnaire global pour stocker les DataFrames en mémoire par session_id
# Note : C'est ok pour un MVP local, mais en prod on utiliserait Redis.
sessions = {}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # 1. Lire le contenu du fichier
    content = await file.read()
    
    # Sécurité : Limite de taille à 20 Mo pour protéger la mémoire du serveur
    MAX_SIZE = 20 * 1024 * 1024 
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="Le fichier est trop volumineux (max 20 Mo).")
        
    # 2. Parser le fichier pour obtenir un DataFrame
    try:
        df = FileParser.parse(content, file.filename)
        columns = get_columns(df)
        
        # 3. Générer un ID de session unique
        session_id = str(uuid.uuid4())
        
        # 4. Stocker le DataFrame en mémoire
        sessions[session_id] = df
        
        return {
            "session_id": session_id,
            "filename": file.filename,
            "columns": columns,
            "message": "Fichier analysé avec succès. Choisissez une colonne."
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
