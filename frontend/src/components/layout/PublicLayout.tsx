// ─────────────────────────────────────────────
//  Mise en page publique (pages accessibles sans connexion)
//  Sémantique : <header> Navbar + <main> contenu + <footer>
// ─────────────────────────────────────────────
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main id="main-content">
        {/* Le contenu de chaque page publique s'injecte ici */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
