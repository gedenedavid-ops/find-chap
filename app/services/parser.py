from fastapi import HTTPException
import pandas as pd
import pdfplumber
import io

class FileParser:
    @staticmethod
    def parse(file_content: bytes, filename: str) -> pd.DataFrame:
        """
        Détermine le format et transforme le contenu en un DataFrame Pandas.
        """
        try:
            if filename.endswith('.csv'):
                return pd.read_csv(io.BytesIO(file_content))
            elif filename.endswith(('.xlsx', '.xls')):
                return pd.read_excel(io.BytesIO(file_content))
            elif filename.endswith('.pdf'):
                return FileParser.parse_pdf(file_content)
            else:
                raise HTTPException(status_code=400, detail="Format non supporté")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erreur lors du parsing : {str(e)}")

    @staticmethod
    def parse_pdf(file_content: bytes) -> pd.DataFrame:
        """
        Gère l'extraction de tableaux depuis un PDF.
        """
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            all_tables = []
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    if table:
                        all_tables.append(pd.DataFrame(table))
            
            if not all_tables:
                raise HTTPException(status_code=400, detail="Aucun tableau trouvé dans le PDF")
            
            # On fusionne les tableaux trouvés (si plusieurs pages)
            df = pd.concat(all_tables, ignore_index=True)
            
            # Nettoyage : On définit la première ligne comme header s'il n'est pas déjà là
            # C'est souvent le cas quand on extrait d'un PDF
            df.columns = df.iloc[0]
            df = df[1:]
            
            return df

def get_columns(df: pd.DataFrame) -> list:
    """Retourne la liste brute des colonnes."""
    return [str(col).strip() for col in df.columns if col is not None]
