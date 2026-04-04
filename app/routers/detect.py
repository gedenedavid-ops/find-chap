from fastapi import APIRouter

router = APIRouter()

@router.post("/detect-columns")
async def detect_columns():
    return {"columns": []}
