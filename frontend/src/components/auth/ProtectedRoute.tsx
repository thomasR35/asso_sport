// ─────────────────────────────────────────────
//  Garde de route protégée
//
//  Vérifie deux conditions avant d'afficher
//  une page de l'espace membre :
//    1. L'utilisateur est connecté
//    2. Son email a été vérifié
//
//  Si non → redirection automatique
// ─────────────────────────────────────────────
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/authStore';
import { Spinner } from '@/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Attendre la fin du chargement initial
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Vérification de la session en cours"
        style={{
          minHeight: '100vh', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Spinner size={40} />
      </div>
    );
  }

  // Pas connecté → page de connexion
  // On mémorise la page demandée pour y revenir après connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Connecté mais email non vérifié → page d'avertissement
  if (user && !user.isVerified) {
    return <Navigate to="/verify-email-notice" replace />;
  }

  return <>{children}</>;
}
