import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// En HeroUI v3, plus besoin de Provider global, tout passe par le CSS
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main className="dark text-foreground min-h-screen">
      <App />
    </main>
  </React.StrictMode>,
)
