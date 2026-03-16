// ─────────────────────────────────────────────
//  main.tsx — démarrage de l'application React
// ─────────────────────────────────────────────
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Un seul import CSS — main.scss orchestre tout
import './styles/main.scss';

import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Élément #root introuvable dans le DOM');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
