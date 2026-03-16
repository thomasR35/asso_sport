// ─────────────────────────────────────────────
//  Navbar publique — styles dans layout/_navbar.scss
// ─────────────────────────────────────────────
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { useAuthStore }  from '@/features/auth/authStore';
import { useLogout }     from '@/features/auth/useAuth';
import { Button }        from '@/components/ui';

const PUBLIC_LINKS = [
  { to: '/',           label: 'Accueil'   },
  { to: '/about',      label: "L'asso"    },
  { to: '/activities', label: 'Activités' },
  { to: '/contact',    label: 'Contact'   },
];

export function Navbar() {
  const [menuOpen, setMenuOpen]    = useState(false);
  const { isAuthenticated, user }  = useAuthStore();
  const logout   = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header" role="banner">
      <nav className="navbar" aria-label="Navigation principale">
        <div className="navbar__inner">

          <Link to="/" className="navbar__logo" aria-label="AS Dynamo — Accueil">
            <span className="navbar__logo-icon" aria-hidden="true">
              <Zap size={20} fill="currentColor" />
            </span>
            <span className="navbar__logo-text">
              AS<span>DYNAMO</span>
            </span>
          </Link>

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

          <button
            className="navbar__burger"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen
              ? <X    size={22} aria-hidden="true" />
              : <Menu size={22} aria-hidden="true" />
            }
          </button>
        </div>

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
                  <Button fullWidth variant="secondary" size="sm"
                    onClick={() => { navigate('/member/dashboard'); closeMenu(); }}>
                    Mon espace
                  </Button>
                  <Button fullWidth variant="ghost" size="sm"
                    loading={logout.isPending} onClick={() => logout.mutate()}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button fullWidth variant="primary"   size="sm"
                    onClick={() => { navigate('/register'); closeMenu(); }}>Adhérer</Button>
                  <Button fullWidth variant="secondary" size="sm"
                    onClick={() => { navigate('/login'); closeMenu(); }}>Connexion</Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
