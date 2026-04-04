from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.routers.upload import sessions
from app.services.finder import RowFinder

router = APIRouter()

class SearchRequest(BaseModel):
    session_id: str
    column: str
    query: str

@router.post("/search")
async def search_row(request: SearchRequest):
    # 1. Vérifier si la session existe
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session expirée ou introuvable. Veuillez retéléverser le fichier.")
    
    df = sessions[request.session_id]
    
    # 2. Effectuer la recherche
    result = RowFinder.find(df, request.column, request.query)
    
    if result is None:
        return {
            "result": None,
            "message": f"Aucun résultat trouvé pour '{request.query}' dans la colonne '{request.column}'."
        }
        
    return {
        "result": result,
        "message": "Étudiant trouvé !"
    }
