// ─────────────────────────────────────────────
//  Logique métier : authentification
//
//  Chaque hook encapsule UNE action utilisateur.
//  Les pages importent ces hooks et ne touchent
//  jamais directement l'API ni le store.
// ─────────────────────────────────────────────
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './authStore';
import { authApi } from '@/services/api/auth.api';
import type { LoginCredentials, RegisterData } from '@/types';

// ── Se connecter ──────────────────────────────
export function useLogin() {
  const login    = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authApi.login(credentials).then((r) => r.data),

    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate('/member/dashboard');
    },
  });
}

// ── S'inscrire ────────────────────────────────
export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) =>
      authApi.register(data).then((r) => r.data),

    onSuccess: () => {
      navigate('/register-success');
    },
  });
}

// ── Se déconnecter ────────────────────────────
export function useLogout() {
  const logout      = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const navigate    = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout().then((r) => r.data),

    // On vide le cache et le store même si le serveur ne répond pas
    onSettled: () => {
      logout();
      queryClient.clear();
      navigate('/');
    },
  });
}
