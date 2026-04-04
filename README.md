# 🚀 FindChap — Indexation et Recherche Ultra-Rapide (Excel, CSV, Tableaux)

FindChap est un outil moderne et puissant conçu pour retrouver instantanément une ligne précise dans n'importe quel fichier de données (Excel, CSV, Tableaux). **Fini de se perdre dans une multitude de lignes ou colonnes**, avec FindChap tu trouves exactement ce que tu cherches en moins de deux, même parmi des fichiers de plus de **50 000+ enregistrements**.

![FindChap Overview](https://img.shields.io/badge/Status-v1.2_Stable-6366f1?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_FastAPI_|_Tailwind-blueviolet?style=for-the-badge)

## ✨ Caractéristiques Premium

- **Design High-End** : Interface sombre élégante avec glassmorphism, animations fluides et typographie premium (Plus Jakarta Sans).
- **Moteur d'Indexation Éclair** : Analyse et sélection personnalisée de colonnes pivots (Matricule, Nom, etc.).
- **Feedback Direct** : Connexion intégrée avec un Webhook Discord pour recevoir les retours utilisateurs en temps réel.
- **Sécurité Maximale** : Traitement local des fichiers durant la session, aucune donnée n'est stockée de façon permanente.
- **Expérience Responsive** : Optimisation parfaite pour mobile, tablette et desktop.

## 🛠️ Stack Technique

- **Frontend** : [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [HeroUI v3](https://heroui.com/) (NextUI v3), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/).
- **Backend** : [FastAPI](https://fastapi.tiangolo.com/), [Pandas](https://pandas.pydata.org/) pour le traitement de données.
- **Communication** : [Axios](https://axios-http.com/) pour les appels API et l'intégration Discord.

## 🚀 Installation & Utilisation

### 1. Pré-requis
- Node.js (v18+)
- Python (v3.10+)

### 2. Installation du Frontend
```bash
npm install
```

### 3. Configuration de l'environnement
Créez un fichier `.env` à la racine :
```env
VITE_DISCORD_WEBHOOK_URL=votre_webhook_discord
```

### 4. Lancement de l'application
```bash
# Lancer le Frontend (Mode Dev)
npm run dev

# Lancer le Backend (Requis pour l'analyse de fichiers)
python -m uvicorn app.main:app --reload
```

## 📝 Licence & Auteur

Propulsé par l'excellence académique.  
**Fait avec ❤️ par Edene David**
