import sys
sys.path.insert(0, '.')
from app.services.parser import FileParser, get_columns
import pandas as pd

file_path = r"C:\Users\geden\Desktop\find-chap\RESULTATS DEFINITIFS_SEMESTRE 4_SESSION 2.xlsx"

with open(file_path, 'rb') as f:
    content = f.read()

df = FileParser.parse(content, file_path)
columns_short = get_columns(df)

print("✅ Colonnes pour SelectColumn (noms raccourcis):")
print(f"Total: {len(columns_short)} colonnes\n")

for i, col in enumerate(columns_short[:20]):
    print(f"{i+1}. {col}")

print(f"\n... et {len(columns_short) - 20} autres colonnes")
