// ─────────────────────────────────────────────
//  Mise en page espace membre (sidebar + contenu)
//  Sémantique : <nav> sidebar + <main> contenu
// ─────────────────────────────────────────────
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, User, Settings,
  LogOut, Zap, Menu, X, ChevronRight,
} from 'lucide-react';
import { useAuthStore }    from '@/features/auth/authStore';
import { useLogout }       from '@/features/auth/useAuth';
import { getInitials }     from '@/utils/helpers';

const SIDEBAR_LINKS = [
  { to: '/member/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/member/calendar',  icon: CalendarDays,    label: 'Calendrier' },
  { to: '/member/profile',   icon: User,            label: 'Mon profil' },
  { to: '/member/settings',  icon: Settings,        label: 'Paramètres' },
];

export function MemberLayout() {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const { user }  = useAuthStore();
  const logout    = useLogout();
  const navigate  = useNavigate();

  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <>
      <div className="member-layout">

        {/* Fond sombre derrière la sidebar mobile */}
        {mobileOpen && (
          <div
            className="sidebar-overlay"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <nav
          className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--open' : ''}`}
          aria-label="Navigation membre"
        >
          {/* Logo */}
          <div className="sidebar__header">
            <button
              className="sidebar__logo"
              onClick={() => navigate('/')}
              aria-label="Retour à l'accueil"
            >
              <span className="sidebar__logo-icon" aria-hidden="true">
                <Zap size={16} fill="currentColor" />
              </span>
              {!collapsed && <span className="sidebar__logo-text">AS<strong>DYNAMO</strong></span>}
            </button>
            <button
              className="sidebar__collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Agrandir la sidebar' : 'Réduire la sidebar'}
              aria-expanded={!collapsed}
            >
              <ChevronRight
                size={16}
                aria-hidden="true"
                style={{ transform: collapsed ? 'none' : 'rotate(180deg)', transition: 'transform 0.2s' }}
              />
            </button>
          </div>

          {/* Profil résumé */}
          <div className="sidebar__profile">
            <div className="sidebar__avatar" aria-hidden="true">{initials}</div>
            {!collapsed && (
              <div className="sidebar__profile-info">
                <p className="sidebar__profile-name">{user?.firstName} {user?.lastName}</p>
                <p className="sidebar__profile-role">Membre actif</p>
              </div>
            )}
          </div>

          {/* Liens de navigation */}
          <ul className="sidebar__nav" role="list">
            {SIDEBAR_LINKS.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? label : undefined}
                  aria-label={collapsed ? label : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Déconnexion */}
          <button
            className="sidebar__logout"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            title={collapsed ? 'Déconnexion' : undefined}
            aria-label="Se déconnecter"
          >
            <LogOut size={16} aria-hidden="true" />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </nav>

        {/* ── Contenu principal ── */}
        <div className="member-body">
          {/* Topbar mobile uniquement */}
          <header className="member-topbar" aria-label="En-tête mobile">
            <button
              className="topbar__burger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="sidebar"
              aria-label="Ouvrir la navigation"
            >
              {mobileOpen
                ? <X size={20} aria-hidden="true" />
                : <Menu size={20} aria-hidden="true" />
              }
            </button>
            <span className="topbar__logo" aria-hidden="true">
              <Zap size={16} fill="currentColor" />
              AS<strong>DYNAMO</strong>
            </span>
          </header>

          <main id="main-content" className="member-content">
            <Outlet />
          </main>
        </div>
      </div>

      <style>{`
        .member-layout { display: flex; min-height: 100vh; }

        /* ── Sidebar ── */
        .sidebar {
          width: 240px; min-height: 100vh; flex-shrink: 0;
          background: var(--color-bg-2); border-right: 1px solid var(--color-border);
          display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh; overflow-y: auto;
          transition: width var(--transition-base);
        }
        .sidebar--collapsed { width: 68px; }
        .sidebar__header {
          height: 64px; padding: 0 12px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--color-border);
        }
        .sidebar__logo {
          display: flex; align-items: center; gap: 8px; cursor: pointer;
          background: none; border: none; color: var(--color-text); text-decoration: none;
          font-family: var(--font-display); font-weight: 900; font-size: 0.95rem;
          letter-spacing: 0.06em; text-transform: uppercase; overflow: hidden;
        }
        .sidebar__logo-icon {
          width: 30px; height: 30px; background: var(--color-primary); border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;
        }
        .sidebar__logo-text { white-space: nowrap; overflow: hidden; }
        .sidebar__collapse-btn {
          color: var(--color-text-dim); background: none; border: none; cursor: pointer;
          padding: 4px; border-radius: var(--radius-sm); display: flex; flex-shrink: 0;
          transition: all var(--transition-fast);
        }
        .sidebar__collapse-btn:hover { background: var(--color-bg-elevated); color: var(--color-text); }

        .sidebar__profile {
          display: flex; align-items: center; gap: 10px;
          margin: 16px 12px; padding: 14px;
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-md); overflow: hidden;
        }
        .sidebar__avatar {
          width: 38px; height: 38px; border-radius: var(--radius-md); flex-shrink: 0;
          background: var(--color-primary); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-weight: 800; font-size: 0.85rem;
        }
        .sidebar__profile-name { font-weight: 600; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sidebar__profile-role {
          font-size: 0.72rem; color: var(--color-primary);
          font-family: var(--font-display); font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        .sidebar__nav { flex: 1; padding: 8px; list-style: none; margin: 0; display: flex; flex-direction: column; gap: 2px; }
        .sidebar__link {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border-radius: var(--radius-md); color: var(--color-text-muted);
          font-size: 0.88rem; font-weight: 500; text-decoration: none;
          transition: all var(--transition-fast); white-space: nowrap; overflow: hidden;
        }
        .sidebar__link:hover, .sidebar__link:focus-visible { background: var(--color-bg-elevated); color: var(--color-text); }
        .sidebar__link--active {
          background: rgba(255,106,0,0.12); color: var(--color-primary);
          border: 1px solid rgba(255,106,0,0.2);
        }

        .sidebar__logout {
          display: flex; align-items: center; gap: 10px; margin: 8px; padding: 10px 12px;
          border-radius: var(--radius-md); color: var(--color-text-dim); cursor: pointer;
          font-size: 0.85rem; font-weight: 500; font-family: var(--font-body);
          background: none; border: none; white-space: nowrap; overflow: hidden;
          transition: all var(--transition-fast);
        }
        .sidebar__logout:hover { background: rgba(239,68,68,0.1); color: var(--color-error); }

        /* ── Zone principale ── */
        .member-body { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .member-topbar {
          display: none; height: 56px; padding: 0 20px;
          background: var(--color-bg-2); border-bottom: 1px solid var(--color-border);
          align-items: center; gap: 16px;
          position: sticky; top: 0; z-index: 50;
        }
        .topbar__burger {
          color: var(--color-text); background: none; border: none; cursor: pointer;
          display: flex; padding: 4px;
        }
        .topbar__logo {
          display: flex; align-items: center; gap: 6px;
          font-family: var(--font-display); font-weight: 900; font-size: 1rem;
          letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text);
        }
        .member-content { flex: 1; padding: 32px; max-width: 1100px; }

        .sidebar-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 49;
          display: none;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed; left: 0; top: 0; z-index: 50; height: 100%;
            transform: translateX(-100%);
            transition: transform var(--transition-base), width var(--transition-base);
            width: 240px !important;
          }
          .sidebar--open { transform: translateX(0); }
          .sidebar__collapse-btn { display: none; }
          .member-topbar { display: flex; }
          .sidebar-overlay { display: block; }
          .member-content { padding: 20px 16px; }
        }
      `}</style>
    </>
  );
}
