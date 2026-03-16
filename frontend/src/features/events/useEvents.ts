// ─────────────────────────────────────────────
//  Logique métier : événements sportifs
// ─────────────────────────────────────────────
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/services/api/events.api';

// Clés de cache React Query — centralisées ici
export const EVENTS_QUERY_KEYS = {
  all:  ['events'] as const,
  one:  (id: number) => ['events', id] as const,
};

// ── Récupérer tous les événements ─────────────
export function useEvents(params?: { month?: string; year?: string }) {
  return useQuery({
    queryKey: [...EVENTS_QUERY_KEYS.all, params],
    queryFn:  () => eventsApi.getAll(params).then((r) => r.data),
    staleTime: 5 * 60 * 1000, // données fraîches pendant 5 minutes
  });
}

// ── Récupérer un événement par ID ─────────────
export function useEvent(id: number) {
  return useQuery({
    queryKey: EVENTS_QUERY_KEYS.one(id),
    queryFn:  () => eventsApi.getOne(id).then((r) => r.data),
    enabled:  !!id,
  });
}

// ── S'inscrire à un événement ─────────────────
export function useRegisterToEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) => eventsApi.register(eventId),
    onSuccess: () => {
      // Invalide le cache pour forcer un rechargement
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['member-events'] });
    },
  });
}

// ── Se désinscrire d'un événement ────────────
export function useUnregisterFromEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) => eventsApi.unregister(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['member-events'] });
    },
  });
}
