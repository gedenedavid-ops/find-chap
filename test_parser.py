import sys
sys.path.insert(0, '.')
from app.services.parser import FileParser
import pandas as pd

file_path = r"C:\Users\geden\Desktop\find-chap\RESULTATS DEFINITIFS_SEMESTRE 4_SESSION 2.xlsx"

# Lire le fichier brut et appliquer le parser
with open(file_path, 'rb') as f:
    content = f.read()

df = FileParser.parse(content, file_path)

print("✅ Après correction du parser:")
print(f"Shape: {df.shape}")
print(f"\nVrais en-têtes trouvés:")
print(f"Colonnes: {df.columns.tolist()[:15]}")
print(f"\nPremières lignes de données (10 premières colonnes):")
print(df.iloc[:5, :10])
