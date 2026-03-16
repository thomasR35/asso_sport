// ─────────────────────────────────────────────
//  Logique métier : espace membre
// ─────────────────────────────────────────────
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '@/services/api/member.api';

// Clés de cache React Query
export const MEMBER_QUERY_KEYS = {
  profile: ['member-profile'] as const,
  events:  ['member-events']  as const,
};

// ── Lire le profil du membre connecté ─────────
export function useMemberProfile() {
  return useQuery({
    queryKey: MEMBER_QUERY_KEYS.profile,
    queryFn:  () => memberApi.getProfile().then((r) => r.data),
  });
}

// ── Mettre à jour le profil ───────────────────
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      firstName: string;
      lastName:  string;
      phone:     string;
      birthDate: string;
    }) => memberApi.updateProfile(data).then((r) => r.data),

    onSuccess: () => {
      // Recharge le profil après mise à jour
      queryClient.invalidateQueries({ queryKey: MEMBER_QUERY_KEYS.profile });
    },
  });
}

// ── Lire les événements du membre ─────────────
export function useMemberEvents() {
  return useQuery({
    queryKey: MEMBER_QUERY_KEYS.events,
    queryFn:  () => memberApi.getMyEvents().then((r) => r.data),
  });
}

// ── Changer le mot de passe ───────────────────
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      memberApi.changePassword(data).then((r) => r.data),
  });
}
