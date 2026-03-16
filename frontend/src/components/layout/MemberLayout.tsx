// ─────────────────────────────────────────────
//  Layout espace membre — styles dans layout/_member-layout.scss
// ─────────────────────────────────────────────
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, User, Settings,
  LogOut, Zap, Menu, X, ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';
import { useLogout }    from '@/features/auth/useAuth';
import { getInitials }  from '@/utils/helpers';

const SIDEBAR_LINKS = [
  { to: '/member/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/member/calendar',  icon: CalendarDays,    label: 'Calendrier' },
  { to: '/member/profile',   icon: User,            label: 'Mon profil' },
  { to: '/member/settings',  icon: Settings,        label: 'Paramètres' },
];

export function MemberLayout() {
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useAuthStore();
  const logout   = useLogout();
  const navigate = useNavigate();

  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <div className="member-layout">

      {mobileOpen && (
        <div
          className="sidebar-overlay"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <nav
        className={[
          'sidebar',
          collapsed  ? 'sidebar--collapsed' : '',
          mobileOpen ? 'sidebar--open'      : '',
        ].filter(Boolean).join(' ')}
        aria-label="Navigation membre"
      >
        <div className="sidebar__header">
          <button
            className="sidebar__logo"
            onClick={() => navigate('/')}
            aria-label="Retour à l'accueil"
          >
            <span className="sidebar__logo-icon" aria-hidden="true">
              <Zap size={16} fill="currentColor" />
            </span>
            {!collapsed && (
              <span className="sidebar__logo-text">AS<strong>DYNAMO</strong></span>
            )}
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
              style={{
                transform:  collapsed ? 'none' : 'rotate(180deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>
        </div>

        <div className="sidebar__profile">
          <div className="sidebar__avatar" aria-hidden="true">{initials}</div>
          {!collapsed && (
            <div>
              <p className="sidebar__profile-name">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="sidebar__profile-role">Membre actif</p>
            </div>
          )}
        </div>

        <ul className="sidebar__nav" role="list">
          {SIDEBAR_LINKS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                }
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

      {/* ── Zone principale ── */}
      <div className="member-body">
        <header className="member-topbar" aria-label="En-tête mobile">
          <button
            className="member-topbar__burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Ouvrir la navigation"
          >
            {mobileOpen
              ? <X    size={20} aria-hidden="true" />
              : <Menu size={20} aria-hidden="true" />
            }
          </button>
          <span className="member-topbar__logo" aria-hidden="true">
            <Zap size={16} fill="currentColor" style={{ color: 'var(--color-primary)' }} />
            AS<strong>DYNAMO</strong>
          </span>
        </header>

        <main id="main-content" className="member-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
