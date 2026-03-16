// ─────────────────────────────────────────────
//  Configuration des routes de l'application
//
//  Structure :
//    /              → pages publiques (sans connexion)
//    /member/*      → pages protégées (connexion requise)
//
//  Pour ajouter une route :
//    1. Importer la page
//    2. L'ajouter dans le groupe approprié
// ─────────────────────────────────────────────
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts (structures de page)
import { PublicLayout }   from '@/components/layout/PublicLayout';
import { MemberLayout }   from '@/components/layout/MemberLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Pages publiques
import { HomePage }         from '@/pages/public/HomePage';
import { LoginPage }        from '@/pages/public/LoginPage';
import { RegisterPage }     from '@/pages/public/RegisterPage';
import {
  ForgotPasswordPage,
  RegisterSuccessPage,
  VerifyEmailNoticePage,
  NotFoundPage,
} from '@/pages/public/OtherPages';

// Pages de l'espace membre
import { DashboardPage } from '@/pages/member/DashboardPage';
import { CalendarPage }  from '@/pages/member/CalendarPage';
import { ProfilePage }   from '@/pages/member/ProfilePage';
import { SettingsPage }  from '@/pages/member/SettingsPage';

export function AppRouter() {
  return (
    <Routes>
      {/* ══════════════════════════════════════
          Pages publiques — accessibles à tous
         ══════════════════════════════════════ */}
      <Route element={<PublicLayout />}>
        <Route path="/"                    element={<HomePage />} />
        <Route path="/login"               element={<LoginPage />} />
        <Route path="/register"            element={<RegisterPage />} />
        <Route path="/register-success"    element={<RegisterSuccessPage />} />
        <Route path="/verify-email-notice" element={<VerifyEmailNoticePage />} />
        <Route path="/forgot-password"     element={<ForgotPasswordPage />} />

        {/* Toute URL inconnue → 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ══════════════════════════════════════
          Espace membre — connexion obligatoire
         ══════════════════════════════════════ */}
      <Route
        path="/member"
        element={
          <ProtectedRoute>
            <MemberLayout />
          </ProtectedRoute>
        }
      >
        {/* /member → redirige vers le dashboard */}
        <Route index element={<Navigate to="/member/dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="calendar"  element={<CalendarPage />} />
        <Route path="profile"   element={<ProfilePage />} />
        <Route path="settings"  element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
