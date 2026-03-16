// ─────────────────────────────────────────────
//  Dashboard membre — styles dans pages/_dashboard.scss
// ─────────────────────────────────────────────
import { useNavigate }   from 'react-router-dom';
import { ArrowRight, CalendarDays, Users, Trophy, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useAuthStore }  from '@/features/auth/authStore';
import { useMemberProfile, useMemberEvents } from '@/features/member/useMember';
import { Button, CategoryBadge, Spinner, Card } from '@/components/ui';
import { getGreeting, formatEventDateShort, formatMonthYear } from '@/utils/helpers';
import type { SportEvent } from '@/types';

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
          {event.location && (
            <span><MapPin size={12} aria-hidden="true" /> {event.location}</span>
          )}
        </div>
      </div>
      {event.isRegistered && (
        <CheckCircle2 size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} aria-label="Inscrit(e)" />
      )}
    </article>
  );
}

export function DashboardPage() {
  const { user }    = useAuthStore();
  const navigate    = useNavigate();
  const { data: profile, isLoading: profileLoading } = useMemberProfile();
  const { data: events,  isLoading: eventsLoading  } = useMemberEvents();

  const upcomingEvents  = (events ?? [])
    .filter((e: SportEvent) => new Date(e.startAt) >= new Date())
    .slice(0, 5);
  const registeredCount = (events ?? []).filter((e: SportEvent) => e.isRegistered).length;

  return (
    <div className="dashboard">

      <section className="dashboard__header" aria-label="Bienvenue">
        <div>
          <p className="dashboard__greeting">{getGreeting()},</p>
          <h1 className="dashboard__name">{user?.firstName} {user?.lastName}</h1>
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

      <section aria-label="Statistiques du compte">
        <ul className="stats-grid" role="list">
          <li className="stat-card">
            <div className="stat-card__icon" style={{ background: 'rgba(255,106,0,0.12)', color: 'var(--color-primary)' }}>
              <CalendarDays size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="stat-card__value">{profileLoading ? '…' : (profile?.upcomingEvents ?? 0)}</p>
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

      <Card>
        <div className="section-header">
          <h2 className="section-header__title">Prochains événements</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/member/calendar')}>
            Tout voir <ArrowRight size={14} aria-hidden="true" />
          </Button>
        </div>

        {eventsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }} role="status">
            <Spinner />
          </div>
        ) : upcomingEvents.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '32px 0', fontSize: '0.9rem' }}>
            Aucun événement à venir. Consultez le calendrier pour découvrir les activités.
          </p>
        ) : (
          <div className="events-list" role="list">
            {upcomingEvents.map((event: SportEvent) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
