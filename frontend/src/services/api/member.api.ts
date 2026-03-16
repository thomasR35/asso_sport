// ─────────────────────────────────────────────
//  Appels HTTP liés à l'espace membre
// ─────────────────────────────────────────────
import apiClient from './apiClient';
import type { MemberProfile, SportEvent } from '@/types';

interface UpdateProfileData {
  firstName: string;
  lastName:  string;
  phone:     string;
  birthDate: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword:     string;
}

export const memberApi = {
  /** Récupérer le profil du membre connecté */
  getProfile: () =>
    apiClient.get<MemberProfile>('/member/profile'),

  /** Mettre à jour les informations personnelles */
  updateProfile: (data: UpdateProfileData) =>
    apiClient.put<MemberProfile>('/member/profile', data),

  /** Récupérer les événements auxquels le membre est inscrit */
  getMyEvents: () =>
    apiClient.get<SportEvent[]>('/member/events'),

  /** Changer le mot de passe depuis l'espace membre */
  changePassword: (data: ChangePasswordData) =>
    apiClient.put<void>('/member/password', data),
};
