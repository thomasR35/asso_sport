// ─────────────────────────────────────────────
//  Client HTTP central — Axios configuré
//
//  Responsabilités :
//    1. Injecter le token JWT dans chaque requête
//    2. Tenter un refresh silencieux si 401
//    3. Déconnecter si le refresh échoue
//
//  Les pages et hooks ne connaissent pas Axios :
//  ils importent uniquement les fonctions métier
//  définies dans auth.api.ts, events.api.ts, etc.
// ─────────────────────────────────────────────
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/features/auth/authStore';
import { API_BASE_URL } from '@/utils/helpers';

// ── Instance Axios ────────────────────────────
const apiClient = axios.create({
  baseURL:         API_BASE_URL,
  withCredentials: true,  // envoie le cookie httpOnly (refresh token)
  headers:         { 'Content-Type': 'application/json' },
  timeout:         10_000,
});

// ── Injection du token JWT ────────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Refresh silencieux en cas de 401 ─────────
let isRefreshing = false;
let pendingQueue: Array<(newToken: string) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Évite la boucle infinie si le refresh lui-même retourne 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/auth/refresh') {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      // Si un refresh est déjà en cours, mettre la requête en file d'attente
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post<{ accessToken: string }>('/auth/refresh');
        const newToken = data.accessToken;

        useAuthStore.getState().setAccessToken(newToken);

        // Relancer toutes les requêtes en attente avec le nouveau token
        pendingQueue.forEach((callback) => callback(newToken));
        pendingQueue = [];

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
