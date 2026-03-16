// ─────────────────────────────────────────────
//  Calendrier — styles dans components/_calendar.scss
// ─────────────────────────────────────────────
import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin     from '@fullcalendar/daygrid';
import timeGridPlugin    from '@fullcalendar/timegrid';
import listPlugin        from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg, EventContentArg } from '@fullcalendar/core';
import { X, Clock, MapPin, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEvents, useRegisterToEvent, useUnregisterFromEvent } from '@/features/events/useEvents';
import { Button, CategoryBadge, Spinner, Alert } from '@/components/ui';
import { EVENT_CATEGORY_COLORS, EVENT_CATEGORY_LABELS } from '@/types';
import type { SportEvent, EventCategory } from '@/types';

export function CalendarPage() {
  const calendarRef = useRef<FullCalendar>(null);
  const [selected, setSelected] = useState<SportEvent | null>(null);

  const isMobile = window.innerWidth < 768;

  const { data: events, isLoading }  = useEvents();
  const registerMutation   = useRegisterToEvent();
  const unregisterMutation = useUnregisterFromEvent();

  const calendarEvents = (events ?? []).map((e: SportEvent) => ({
    id:    String(e.id),
    title: e.title,
    start: e.startAt,
    end:   e.endAt,
    color: EVENT_CATEGORY_COLORS[e.category],
    extendedProps: { event: e },
  }));

  const handleEventClick = (info: EventClickArg) => {
    setSelected(info.event.extendedProps.event as SportEvent);
  };

  const closeModal = () => setSelected(null);

  const isFull = selected
    ? selected.maxParticipants !== null &&
      selected.currentParticipants >= selected.maxParticipants
    : false;

  const handleRegister = () => {
    if (!selected) return;
    registerMutation.mutate(selected.id, {
      onSuccess: () =>
        setSelected((prev) =>
          prev ? { ...prev, isRegistered: true, currentParticipants: prev.currentParticipants + 1 } : prev
        ),
    });
  };

  const handleUnregister = () => {
    if (!selected) return;
    unregisterMutation.mutate(selected.id, {
      onSuccess: () =>
        setSelected((prev) =>
          prev ? { ...prev, isRegistered: false, currentParticipants: prev.currentParticipants - 1 } : prev
        ),
    });
  };

  return (
    <>
      <div className="calendar-page">

        <header className="page-header" style={{ animation: 'fadeInUp 0.4s ease both' }}>
          <h1 className="page-title">Calendrier</h1>
          <p className="page-subtitle">
            Retrouvez tous les événements de l'association et inscrivez-vous directement.
          </p>
        </header>

        {isLoading ? (
          <div
            role="status"
            aria-label="Chargement du calendrier"
            style={{ display: 'flex', justifyContent: 'center', padding: 64 }}
          >
            <Spinner size={36} />
          </div>
        ) : (
          <section
            className="calendar-wrap"
            aria-label="Calendrier des événements"
            style={{ animation: 'fadeInUp 0.4s ease 0.1s both' }}
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView={isMobile ? 'listMonth' : 'dayGridMonth'}
              locale="fr"
              firstDay={1}
              headerToolbar={{
                left:   'prev,next today',
                center: 'title',
                right:  'dayGridMonth,timeGridWeek,listMonth',
              }}
              buttonText={{
                today: "Aujourd'hui",
                month: 'Mois',
                week:  'Semaine',
                list:  'Liste',
              }}
              events={calendarEvents}
              eventClick={handleEventClick}
              height="auto"
              eventContent={renderEventContent}
              dayMaxEvents={3}
            />
          </section>
        )}

        <aside aria-label="Légende des catégories">
          <ul className="legend" role="list">
            {(Object.entries(EVENT_CATEGORY_COLORS) as [EventCategory, string][]).map(
              ([cat, color]) => (
                <li key={cat} className="legend__item">
                  <span className="legend__dot" style={{ background: color }} aria-hidden="true" />
                  {EVENT_CATEGORY_LABELS[cat]}
                </li>
              )
            )}
          </ul>
        </aside>
      </div>

      {/* ── Modal détail événement ── */}
      {selected && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={closeModal}
        >
          <dialog
            className="event-modal"
            open
            aria-labelledby="modal-title"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="event-modal__close"
              onClick={closeModal}
              aria-label="Fermer la fenêtre"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <div className="event-modal__badges">
              <CategoryBadge category={selected.category} />
              {selected.isRegistered && (
                <span className="badge-registered" role="status">
                  <CheckCircle2 size={14} aria-hidden="true" /> Inscrit(e)
                </span>
              )}
            </div>

            <h2 id="modal-title" className="event-modal__title">
              {selected.title}
            </h2>

            <dl className="event-modal__meta">
              <div className="event-modal__meta-item">
                <dt className="sr-only">Date et heure</dt>
                <dd>
                  <Clock size={15} aria-hidden="true" />
                  <time dateTime={selected.startAt}>
                    {format(parseISO(selected.startAt), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </time>
                  {selected.endAt && (
                    <>
                      {' → '}
                      <time dateTime={selected.endAt}>
                        {format(parseISO(selected.endAt), 'HH:mm')}
                      </time>
                    </>
                  )}
                </dd>
              </div>

              {selected.location && (
                <div className="event-modal__meta-item">
                  <dt className="sr-only">Lieu</dt>
                  <dd><MapPin size={15} aria-hidden="true" /> {selected.location}</dd>
                </div>
              )}

              {selected.maxParticipants && (
                <div className="event-modal__meta-item">
                  <dt className="sr-only">Participants</dt>
                  <dd>
                    <Users size={15} aria-hidden="true" />
                    {selected.currentParticipants} / {selected.maxParticipants} participants
                    {isFull && !selected.isRegistered && (
                      <span className="badge-full" aria-label="Événement complet">
                        Complet
                      </span>
                    )}
                  </dd>
                </div>
              )}
            </dl>

            {selected.description && (
              <p className="event-modal__description">{selected.description}</p>
            )}

            {registerMutation.isError && (
              <Alert variant="error">
                Une erreur est survenue lors de l'inscription.
              </Alert>
            )}

            {isFull && !selected.isRegistered ? (
              <Alert variant="warning">
                <AlertCircle size={14} style={{ display: 'inline', marginRight: 6 }} aria-hidden="true" />
                Cet événement est complet.
              </Alert>
            ) : selected.isRegistered ? (
              <Button
                variant="danger"
                fullWidth
                loading={unregisterMutation.isPending}
                onClick={handleUnregister}
              >
                Se désinscrire
              </Button>
            ) : (
              <Button
                variant="primary"
                fullWidth
                loading={registerMutation.isPending}
                onClick={handleRegister}
              >
                S'inscrire à cet événement
              </Button>
            )}
          </dialog>
        </div>
      )}
    </>
  );
}

function renderEventContent(arg: EventContentArg) {
  return (
    <div style={{
      padding:      '2px 6px',
      fontSize:     '0.75rem',
      fontWeight:   600,
      overflow:     'hidden',
      textOverflow: 'ellipsis',
      whiteSpace:   'nowrap',
      cursor:       'pointer',
    }}>
      {arg.event.title}
    </div>
  );
}
