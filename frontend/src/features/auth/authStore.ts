// ─────────────────────────────────────────────
//  Store d'authentification (Zustand)
//
//  Contient uniquement l'état de session :
//  qui est connecté, son token, son statut.
//  La logique de connexion est dans useLogin.ts
// ─────────────────────────────────────────────
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user:            User | null;
  accessToken:     string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;

  // Actions
  setUser:         (user: User) => void;
  setAccessToken:  (token: string) => void;
  setLoading:      (loading: boolean) => void;
  login:           (user: User, token: string) => void;
  logout:          () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      accessToken:     null,
      isAuthenticated: false,
      isLoading:       false,

      setUser:        (user)          => set({ user }),
      setAccessToken: (accessToken)   => set({ accessToken }),
      setLoading:     (isLoading)     => set({ isLoading }),

      login: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true, isLoading: false }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name:    'auth-storage',
      // sessionStorage : la session disparaît à la fermeture du navigateur
      storage: createJSONStorage(() => sessionStorage),
      // On ne persiste que ce qui est strictement nécessaire
      partialize: (state) => ({
        user:            state.user,
        accessToken:     state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
