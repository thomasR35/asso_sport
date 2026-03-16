// ─────────────────────────────────────────────
//  Fonctions utilitaires pures
//  Pas d'état, pas d'effets de bord.
// ─────────────────────────────────────────────

// ── Constantes de l'application ───────────────
export const APP_NAME        = 'AS Dynamo';
export const API_BASE_URL    = '/api';
export const TOKEN_STORE_KEY = 'auth-storage';

// Règles mot de passe (utilisées dans l'indicateur de force)
export const PASSWORD_STRENGTH_RULES = [
  { label: '8 caractères minimum',  test: (v: string) => v.length >= 8 },
  { label: '1 majuscule',           test: (v: string) => /[A-Z]/.test(v) },
  { label: '1 minuscule',           test: (v: string) => /[a-z]/.test(v) },
  { label: '1 chiffre',             test: (v: string) => /[0-9]/.test(v) },
  { label: '1 caractère spécial',   test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

// ── Formatage de dates ─────────────────────────
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/** Affiche "lundi 3 juin 2025 à 18h30" */
export function formatEventDate(isoString: string): string {
  return format(parseISO(isoString), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr });
}

/** Affiche "jeu. 3 juin, 18:30" */
export function formatEventDateShort(isoString: string): string {
  return format(parseISO(isoString), 'EEE d MMM, HH:mm', { locale: fr });
}

/** Affiche "juin 2025" */
export function formatMonthYear(isoString: string): string {
  return format(parseISO(isoString), 'MMMM yyyy', { locale: fr });
}

// ── Utilitaires divers ─────────────────────────

/** Extrait les initiales (ex : "Jean Dupont" → "JD") */
export function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

/** Retourne "Bonjour", "Bon après-midi" ou "Bonsoir" selon l'heure */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

/** Extrait le message d'erreur d'une réponse Axios */
export function extractApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue'): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message ?? fallback;
  }
  return fallback;
}
