// ─────────────────────────────────────────────
//  Navbar publique
//  Sémantique : <header> + <nav> + <ul>/<li>
// ─────────────────────────────────────────────
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';
import { useLogout } from '@/features/auth/useAuth';
import { Button } from '@/components/ui';

const PUBLIC_LINKS = [
  { to: '/',           label: 'Accueil'    },
  { to: '/about',      label: "L'asso"     },
  { to: '/activities', label: 'Activités'  },
  { to: '/contact',    label: 'Contact'    },
];

export function Navbar() {
  const [menuOpen, setMenuOpen]  = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const logout   = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header" role="banner">
        <nav className="navbar" aria-label="Navigation principale">
          <div className="navbar__inner">

            {/* Identité de l'asso */}
            <Link to="/" className="navbar__logo" aria-label="AS Dynamo — Accueil">
              <span className="navbar__logo-icon" aria-hidden="true">
                <Zap size={20} fill="currentColor" />
              </span>
              <span className="navbar__logo-text">
                AS<span aria-hidden="true">DYNAMO</span>
              </span>
            </Link>

            {/* Liens principaux — desktop */}
            <ul className="navbar__links" role="list">
              {PUBLIC_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`navbar__link ${location.pathname === to ? 'navbar__link--active' : ''}`}
                    aria-current={location.pathname === to ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions — desktop */}
            <div className="navbar__actions">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/member/dashboard')}>
                    {user?.firstName}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={logout.isPending}
                    onClick={() => logout.mutate()}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost"   size="sm" onClick={() => navigate('/login')}>Connexion</Button>
                  <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Adhérer</Button>
                </>
              )}
            </div>

            {/* Bouton burger — mobile */}
            <button
              className="navbar__burger"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>

          {/* Menu mobile */}
          {menuOpen && (
            <div id="mobile-menu" className="navbar__mobile">
              <ul role="list">
                {PUBLIC_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="navbar__mobile-link"
                      aria-current={location.pathname === to ? 'page' : undefined}
                      onClick={closeMenu}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="navbar__mobile-actions">
                {isAuthenticated ? (
                  <>
                    <Button fullWidth variant="secondary" size="sm" onClick={() => { navigate('/member/dashboard'); closeMenu(); }}>
                      Mon espace
                    </Button>
                    <Button fullWidth variant="ghost" size="sm" loading={logout.isPending} onClick={() => logout.mutate()}>
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button fullWidth variant="primary"   size="sm" onClick={() => { navigate('/register'); closeMenu(); }}>Adhérer</Button>
                    <Button fullWidth variant="secondary" size="sm" onClick={() => { navigate('/login');    closeMenu(); }}>Connexion</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <style>{`
        .site-header {
          position: sticky; top: 0; z-index: 100;
          background: rgba(14,15,17,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--color-border);
        }
        .navbar__inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          height: 64px; display: flex; align-items: center; gap: 32px;
        }
        .navbar__logo {
          display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0;
        }
        .navbar__logo-icon {
          width: 34px; height: 34px; background: var(--color-primary);
          border-radius: var(--radius-sm); display: flex; align-items: center;
          justify-content: center; color: #fff;
        }
        .navbar__logo-text {
          font-family: var(--font-display); font-weight: 900; font-size: 1.15rem;
          letter-spacing: 0.06em; color: var(--color-text); text-transform: uppercase;
        }
        .navbar__logo-text span { color: var(--color-primary); }

        .navbar__links {
          display: flex; align-items: center; gap: 4px; flex: 1;
          list-style: none; margin: 0; padding: 0;
        }
        .navbar__link {
          display: block; padding: 6px 14px; border-radius: var(--radius-sm);
          font-family: var(--font-display); font-weight: 700; font-size: 0.82rem;
          letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-muted);
          text-decoration: none; transition: all var(--transition-fast);
        }
        .navbar__link:hover, .navbar__link:focus-visible {
          color: var(--color-text); background: var(--color-bg-elevated);
        }
        .navbar__link--active { color: var(--color-primary); }

        .navbar__actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .navbar__burger   { display: none; color: var(--color-text); padding: 8px; background: none; border: none; cursor: pointer; }

        .navbar__mobile {
          padding: 16px 24px 24px; display: flex; flex-direction: column; gap: 4px;
          border-top: 1px solid var(--color-border); animation: fadeIn 0.15s ease;
        }
        .navbar__mobile ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
        .navbar__mobile-link {
          display: block; padding: 12px 16px; border-radius: var(--radius-md);
          font-family: var(--font-display); font-weight: 700; font-size: 0.9rem;
          letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-muted);
          text-decoration: none; transition: all var(--transition-fast);
        }
        .navbar__mobile-link:hover { color: var(--color-text); background: var(--color-bg-elevated); }
        .navbar__mobile-actions {
          display: flex; flex-direction: column; gap: 8px; margin-top: 12px;
          padding-top: 16px; border-top: 1px solid var(--color-border);
        }

        @media (max-width: 768px) {
          .navbar__links, .navbar__actions { display: none; }
          .navbar__burger { display: flex; margin-left: auto; }
        }
      `}</style>
    </>
  );
}
