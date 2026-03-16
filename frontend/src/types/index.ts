// ─────────────────────────────────────────────
//  Contrats TypeScript partagés dans toute l'app
//  Un type = une entité du monde réel
// ─────────────────────────────────────────────

// ── Utilisateur ──────────────────────────────
export interface User {
  id: number;
  email: string;
  role: 'member' | 'admin';
  firstName: string;
  lastName: string;
  isVerified: boolean;
  createdAt: string;
}

// ── Formulaires d'authentification ───────────
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  acceptTerms: boolean;
}

// ── Événement sportif ─────────────────────────
export interface SportEvent {
  id: number;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  location: string;
  maxParticipants: number | null;
  currentParticipants: number;
  isRegistered: boolean;
  category: EventCategory;
  color?: string;
}

export type EventCategory =
  | 'training'
  | 'competition'
  | 'social'
  | 'meeting'
  | 'other';

// Libellés lisibles par les humains
export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  training:    'Entraînement',
  competition: 'Compétition',
  social:      'Événement social',
  meeting:     'Réunion',
  other:       'Autre',
};

// Couleur associée à chaque catégorie
export const EVENT_CATEGORY_COLORS: Record<EventCategory, string> = {
  training:    '#ff6a00',
  competition: '#ffd200',
  social:      '#22c55e',
  meeting:     '#3b82f6',
  other:       '#8b5cf6',
};

// ── Profil membre ─────────────────────────────
export interface MemberProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  memberSince: string;
  upcomingEvents: number;
}

// ── Réponses API génériques ───────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
