import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted fonts (RGPD/PECR : plus aucun appel à fonts.googleapis.com,
// donc aucune transmission de l'IP des visiteurs à Google). On n'importe que
// les sous-ensembles latin + latin-ext (couvre les accents FR/PT/ES des noms
// de l'équipe) ; grâce à unicode-range, le navigateur ne télécharge que ce
// dont il a besoin.
import '@fontsource/league-spartan/latin-300.css'
import '@fontsource/league-spartan/latin-400.css'
import '@fontsource/league-spartan/latin-500.css'
import '@fontsource/league-spartan/latin-600.css'
import '@fontsource/league-spartan/latin-700.css'
import '@fontsource/league-spartan/latin-800.css'
import '@fontsource/league-spartan/latin-ext-400.css'
import '@fontsource/league-spartan/latin-ext-700.css'
import '@fontsource/poppins/latin-300.css'
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-600.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/poppins/latin-ext-400.css'
import '@fontsource/poppins/latin-300-italic.css'
import '@fontsource/poppins/latin-400-italic.css'
import '@fontsource/poppins/latin-700-italic.css'
import '@fontsource/dm-sans/latin-300.css'
import '@fontsource/dm-sans/latin-400.css'
import '@fontsource/dm-sans/latin-500.css'
import '@fontsource/dm-sans/latin-600.css'
import '@fontsource/dm-sans/latin-ext-400.css'

import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
