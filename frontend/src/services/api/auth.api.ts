// ─────────────────────────────────────────────
//  Appels HTTP liés à l'authentification
//  Une fonction = un endpoint
// ─────────────────────────────────────────────
import apiClient from './apiClient';
import type { LoginCredentials, RegisterData, User } from '@/types';

export interface LoginResponse {
  user:        User;
  accessToken: string;
}

export const authApi = {
  /** Connexion — retourne l'utilisateur + un access token JWT */
  login: (credentials: LoginCredentials) =>
    apiClient.post<LoginResponse>('/auth/login', credentials),

  /** Inscription — envoie un email de confirmation */
  register: (data: RegisterData) =>
    apiClient.post<{ message: string }>('/auth/register', data),

  /** Déconnexion — invalide le refresh token côté serveur */
  logout: () =>
    apiClient.post<void>('/auth/logout'),

  /** Obtenir un nouvel access token via le cookie refresh */
  refreshToken: () =>
    apiClient.post<{ accessToken: string }>('/auth/refresh'),

  /** Vérifier l'adresse email après inscription */
  verifyEmail: (token: string) =>
    apiClient.get<void>(`/auth/verify-email?token=${token}`),

  /** Demander un email de réinitialisation de mot de passe */
  forgotPassword: (email: string) =>
    apiClient.post<void>('/auth/forgot-password', { email }),

  /** Réinitialiser le mot de passe avec le token reçu par email */
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<void>('/auth/reset-password', { token, newPassword }),
};
