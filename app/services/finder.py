import pandas as pd

class RowFinder:
    @staticmethod
    def find(df: pd.DataFrame, column: str, query: str) -> dict:
        """
        Recherche une valeur dans une colonne spécifique et retourne la ligne complète.
        """
        # Convertir query en string pour comparaison
        query = str(query).strip().lower()
        
        # On s'assure que la colonne existe
        if column not in df.columns:
            raise ValueError(f"Colonne '{column}' introuvable. Colonnes disponibles: {list(df.columns)}")
        
        # On normalise les données de la colonne pour la recherche (insensible à la casse)
        # On recherche une correspondance exacte (même si c'est du fuzzy search dans le futur)
        mask = df[column].astype(str).str.strip().str.lower() == query
        
        result_df = df[mask]
        
        if result_df.empty:
            return None
        
        # On retourne la première ligne trouvée sous forme de dictionnaire simple
        # On gère les valeurs NaN pour qu'elles soient null dans le JSON
        return result_df.iloc[0].where(pd.notnull(result_df.iloc[0]), None).to_dict()
