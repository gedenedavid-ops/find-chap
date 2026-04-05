from fastapi import HTTPException
import pandas as pd
import pdfplumber
import io

class FileParser:
    @staticmethod
    def _shorten_column_name(full_name: str) -> str:
        """
        Raccourcit intelligemment les noms de colonnes longs.
        Ex: 'SEMESTRE 3 - HLFI64203 : ... - HLFI64203-1 (CC)' → 'HLFI64203-1 (CC)'
        """
        # Si le nom est déjà court, le garder
        if len(full_name) < 50:
            return full_name
        
        import re
        
        # Chercher les patterns courants
        evaluation_pattern = r'(\w{4}\d{5}(?:-\d)?\s*\([A-Z]+\))'
        eval_matches = re.findall(evaluation_pattern, full_name)
        
        if eval_matches:
            return eval_matches[-1].strip()
        
        # Chercher les mots-clés spéciaux en fin de string
        special_keywords = ['MOYENNE', 'CREDIT', 'ANNEE', 'SESSION', 'DECISION', 'OBSERVATION', 'VALIDATION']
        for keyword in special_keywords:
            if keyword in full_name.upper():
                # Récupérer le bout avec le mot-clé
                idx = full_name.upper().rfind(keyword)
                if idx > 0:
                    # Récupérer depuis le dernier "-" avant le keyword ou directement le keyword
                    last_dash = full_name.rfind('-', 0, idx)
                    if last_dash > 0:
                        return full_name[last_dash+1:].strip()
                    else:
                        return full_name[max(0, idx-30):].strip()
        
        # Fallback: prendre les 45 derniers caractères
        return "..." + full_name[-45:].strip()
    
    @staticmethod
    def _flatten_multiindex_columns(df: pd.DataFrame) -> pd.DataFrame:
        """
        Fusionne les colonnes MultiIndex en noms simples et intuitifs.
        Exemple: ['SEMESTRE 3', 'HLFI64203', 'CC'] → 'SEMESTRE 3 - HLFI64203 (CC)'
        """
        if isinstance(df.columns, pd.MultiIndex):
            new_columns = []
            for col_tuple in df.columns:
                # Filtrer les valeurs vides/NaN et "Unnamed: X_level_Y"
                parts = []
                for x in col_tuple:
                    if pd.isna(x):
                        continue
                    x_str = str(x).strip()
                    # Ignorer les Unnamed avec level
                    if x_str.startswith("Unnamed:") and "_level_" in x_str:
                        continue
                    # Ignorer les Unnamed: X seuls s'ils ne sont pas significatifs
                    if x_str.startswith("Unnamed:"):
                        continue
                    if x_str and x_str.lower() != "nan":
                        parts.append(x_str)
                
                if not parts:
                    new_columns.append("Unnamed")
                elif len(parts) == 1:
                    new_columns.append(parts[0])
                else:
                    # Formater intelligemment selon le contexte
                    # Chercher si le dernier élément est un type d'évaluation ou une moyenne
                    last_part = parts[-1]
                    if last_part in ['CC', 'CT', 'CCT', 'CCP', 'TP', 'Examen', '(CC)', '(CT)', '(CCT)']:
                        base = " - ".join(parts[:-1])
                        new_columns.append(f"{base} ({last_part.replace('(', '').replace(')', '')})")
                    elif last_part.upper() in ['MOYENNE', 'MOYENNE UE']:
                        base = " - ".join(parts[:-1])
                        new_columns.append(f"{base} {last_part}")
                    else:
                        # Simple join with -
                        new_columns.append(" - ".join(parts))
            
            df.columns = new_columns
        
        return df
    
    @staticmethod
    def parse(file_content: bytes, filename: str) -> pd.DataFrame:
        """
        Détermine le format et transforme le contenu en un DataFrame Pandas.
        """
        try:
            if filename.endswith('.csv'):
                return pd.read_csv(io.BytesIO(file_content))
            elif filename.endswith(('.xlsx', '.xls')):
                # Lecture brute pour détecter la ligne d'en-têtes
                df_raw = pd.read_excel(io.BytesIO(file_content), header=None)
                
                # Détection de la ligne d'en-têtes réelle:
                # Chercher la première ligne contenant "N°", "Identifiant", "Numero", "Nom"
                # ou simplement la première ligne avec beaucoup de valeurs non-nulles ET texte/identifiants
                header_row = None
                keyword_patterns = ['n°', 'num', 'identif', 'nom', 'prenom', 'code', 'etudiant']
                
                for idx, row in df_raw.iterrows():
                    row_str = str(row).lower()
                    # Vérifier si cette ligne contient les mots-clés des en-têtes
                    if any(pattern in row_str for pattern in keyword_patterns):
                        non_null_count = row.notna().sum()
                        if non_null_count >= 3:  # Au moins 3 colonnes avec du contenu
                            header_row = idx
                            break
                
                # Si un en-tête a été trouvé et qu'il n'est pas la première ligne
                if header_row is not None and header_row > 0:
                    # Vérifier s'il y a une structure multi-niveaux
                    df_raw_check = pd.read_excel(io.BytesIO(file_content), header=None, 
                                                 nrows=header_row + 3)
                    
                    # Checker si les lignes suivantes contiennent des en-têtes de niveau 2
                    has_multilevel = False
                    multilevel_rows = [header_row]
                    
                    if header_row + 1 < len(df_raw_check):
                        row_after = df_raw_check.iloc[header_row + 1]
                        # Vérifier si cette ligne a beaucoup de contenu (en-têtes de modules)
                        if row_after.notna().sum() > 5:
                            has_multilevel = True
                            multilevel_rows.append(header_row + 1)
                            
                            # Vérifier aussi la ligne d'après
                            if header_row + 2 < len(df_raw_check):
                                row_after_2 = df_raw_check.iloc[header_row + 2]
                                if row_after_2.notna().sum() > 5:
                                    multilevel_rows.append(header_row + 2)
                    
                    # Charger avec les en-têtes détectés
                    if has_multilevel and len(multilevel_rows) > 1:
                        df = pd.read_excel(io.BytesIO(file_content), header=multilevel_rows)
                        df = FileParser._flatten_multiindex_columns(df)
                    else:
                        df = pd.read_excel(io.BytesIO(file_content), header=header_row)
                    
                    # Nettoyer les colonnes vides
                    df = df.dropna(axis=1, how='all')
                    # Supprimer les lignes complètement vides
                    df = df.dropna(axis=0, how='all')
                    df = df.reset_index(drop=True)
                else:
                    # Fallback: utiliser la lecture standard
                    df = pd.read_excel(io.BytesIO(file_content))
                
                return df
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
    """
    Retourne la liste des colonnes significatives avec des noms courts et intuitifs.
    Filtre les colonnes "Unnamed" qui ne contiennent pas de data.
    """
    columns = []
    for col in df.columns:
        col_name = str(col).strip()
        if col_name is None or col_name == "":
            continue
        
        # Filtrer les colonnes "Unnamed" qui sont complètement vides
        if col_name.startswith("Unnamed"):
            # Vérifier si cette colonne a au moins quelques valeurs non-nulles
            if df[col].notna().sum() < 2:  # Moins de 2 valeurs non-nulles
                continue
        
        # Générer un nom court pour les colonnes trop longues
        short_name = FileParser._shorten_column_name(col_name)
        columns.append(short_name)
    
    return columns
