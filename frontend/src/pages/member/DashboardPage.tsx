// ─────────────────────────────────────────────
//  Tableau de bord membre
//  Logique : useMemberProfile + useMemberEvents
//  Sémantique : <main> > <section> + <article>
// ─────────────────────────────────────────────
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Users, Trophy, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useAuthStore }      from '@/features/auth/authStore';
import { useMemberProfile, useMemberEvents } from '@/features/member/useMember';
import { Button, CategoryBadge, Spinner, Card } from '@/components/ui';
import { getGreeting, getInitials, formatEventDateShort, formatMonthYear } from '@/utils/helpers';
import type { SportEvent } from '@/types';

// ── Composant local : ligne d'événement ──────
function EventRow({ event }: { event: SportEvent }) {
  return (
    <article className="event-row" aria-label={event.title}>
      <div
        className="event-row__color"
        style={{ background: event.color ?? 'var(--color-primary)' }}
        aria-hidden="true"
      />
      <div className="event-row__body">
        <div className="event-row__top">
          <h3 className="event-row__title">{event.title}</h3>
          <CategoryBadge category={event.category} />
        </div>
        <div className="event-row__meta">
          <span><Clock size={12} aria-hidden="true" /> {formatEventDateShort(event.startAt)}</span>
          {event.location && <span><MapPin size={12} aria-hidden="true" /> {event.location}</span>}
        </div>
      </div>
      {event.isRegistered && (
        <CheckCircle2
          size={18}
          style={{ color: 'var(--color-success)', flexShrink: 0 }}
          aria-label="Inscrit(e)"
        />
      )}
    </article>
  );
}

// ── Page principale ───────────────────────────
export function DashboardPage() {
  const { user }    = useAuthStore();
  const navigate    = useNavigate();

  const { data: profile, isLoading: profileLoading } = useMemberProfile();
  const { data: events,  isLoading: eventsLoading  } = useMemberEvents();

  const upcomingEvents = (events ?? [])
    .filter((e: SportEvent) => new Date(e.startAt) >= new Date())
    .slice(0, 5);

  const registeredCount = (events ?? []).filter((e: SportEvent) => e.isRegistered).length;

  return (
    <>
      <div className="dashboard">

        {/* ── En-tête personnalisé ── */}
        <section className="dashboard__header" aria-label="Bienvenue">
          <div>
            <p className="dashboard__greeting">
              {getGreeting()},
            </p>
            <h1 className="dashboard__name">
              {user?.firstName} {user?.lastName}
            </h1>
            {profile && !profileLoading && (
              <p className="dashboard__since">
                Membre depuis <time dateTime={profile.memberSince}>
                  {formatMonthYear(profile.memberSince)}
                </time>
              </p>
            )}
          </div>

          <Button onClick={() => navigate('/member/calendar')}>
            Voir le calendrier <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </section>

        {/* ── Statistiques rapides ── */}
        <section aria-label="Statistiques du compte">
          <ul className="stats-grid" role="list">
            <li className="stat-card">
              <div className="stat-card__icon" style={{ background: 'rgba(255,106,0,0.12)', color: 'var(--color-primary)' }}>
                <CalendarDays size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="stat-card__value">
                  {profileLoading ? '…' : (profile?.upcomingEvents ?? 0)}
                </p>
                <p className="stat-card__label">Événements à venir</p>
              </div>
            </li>

            <li className="stat-card">
              <div className="stat-card__icon" style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--color-success)' }}>
                <CheckCircle2 size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="stat-card__value">{eventsLoading ? '…' : registeredCount}</p>
                <p className="stat-card__label">Inscriptions actives</p>
              </div>
            </li>

            <li className="stat-card">
              <div className="stat-card__icon" style={{ background: 'rgba(255,210,0,0.12)', color: 'var(--color-accent)' }}>
                <Trophy size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="stat-card__value">Actif</p>
                <p className="stat-card__label">Statut membre</p>
              </div>
            </li>

            <li className="stat-card">
              <div className="stat-card__icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
                <Users size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="stat-card__value">240+</p>
                <p className="stat-card__label">Membres dans l'asso</p>
              </div>
            </li>
          </ul>
        </section>

        {/* ── Prochains événements ── */}
        <Card>
          <div className="section-header">
            <h2 className="section-header__title">Prochains événements</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/member/calendar')}>
              Tout voir <ArrowRight size={14} aria-hidden="true" />
            </Button>
          </div>

          {eventsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }} role="status" aria-label="Chargement des événements">
              <Spinner />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '32px 0', fontSize: '0.9rem' }}>
              Aucun événement à venir. Consultez le calendrier pour découvrir les activités.
            </p>
          ) : (
            <div className="events-list" role="list" aria-label="Liste des prochains événements">
              {upcomingEvents.map((event: SportEvent) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          )}
        </Card>
      </div>

      <style>{`
        .dashboard { display: flex; flex-direction: column; gap: 28px; }

        .dashboard__header {
          display: flex; justify-content: space-between; align-items: flex-end;
          flex-wrap: wrap; gap: 16px; animation: fadeInUp 0.4s ease both;
        }
        .dashboard__greeting {
          font-family: var(--font-display); font-weight: 700; font-size: 0.9rem;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--color-text-muted); margin-bottom: 4px;
        }
        .dashboard__name {
          font-family: var(--font-display); font-weight: 900; font-size: 2.2rem;
          text-transform: uppercase; letter-spacing: 0.02em; line-height: 1; margin-bottom: 6px;
        }
        .dashboard__since { font-size: 0.85rem; color: var(--color-text-muted); }

        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
          list-style: none; padding: 0; margin: 0;
          animation: fadeInUp 0.4s ease 0.1s both;
        }
        .stat-card {
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); padding: 20px;
          display: flex; align-items: center; gap: 14px;
          transition: border-color var(--transition-fast);
        }
        .stat-card:hover { border-color: var(--color-border-hover); }
        .stat-card__icon {
          width: 44px; height: 44px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .stat-card__value {
          font-family: var(--font-display); font-weight: 900; font-size: 1.6rem; line-height: 1;
        }
        .stat-card__label { font-size: 0.78rem; color: var(--color-text-muted); margin-top: 2px; }

        .section-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
        }
        .section-header__title {
          font-family: var(--font-display); font-weight: 800; font-size: 1rem;
          text-transform: uppercase; letter-spacing: 0.05em;
        }

        .events-list { display: flex; flex-direction: column; gap: 2px; }
        .event-row {
          display: flex; align-items: center; gap: 14px; padding: 14px 12px;
          border-radius: var(--radius-md); transition: background var(--transition-fast);
        }
        .event-row:hover { background: var(--color-bg-elevated); }
        .event-row__color { width: 3px; height: 40px; border-radius: 2px; flex-shrink: 0; }
        .event-row__body  { flex: 1; min-width: 0; }
        .event-row__top {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px;
        }
        .event-row__title {
          font-weight: 600; font-size: 0.92rem;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .event-row__meta {
          display: flex; align-items: center; gap: 14px;
          color: var(--color-text-muted); font-size: 0.78rem;
        }
        .event-row__meta span { display: flex; align-items: center; gap: 4px; }

        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
