// ─────────────────────────────────────────────
//  Appels HTTP liés aux événements sportifs
// ─────────────────────────────────────────────
import apiClient from './apiClient';
import type { SportEvent } from '@/types';

export const eventsApi = {
  /** Récupérer tous les événements (avec filtres optionnels) */
  getAll: (params?: { month?: string; year?: string }) =>
    apiClient.get<SportEvent[]>('/events', { params }),

  /** Récupérer un événement par son identifiant */
  getOne: (id: number) =>
    apiClient.get<SportEvent>(`/events/${id}`),

  /** S'inscrire à un événement */
  register: (id: number) =>
    apiClient.post<void>(`/events/${id}/register`),

  /** Se désinscrire d'un événement */
  unregister: (id: number) =>
    apiClient.delete<void>(`/events/${id}/register`),
};
