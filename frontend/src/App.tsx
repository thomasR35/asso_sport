// ─────────────────────────────────────────────
//  Point d'entrée React
//
//  Responsabilités :
//    - Déclarer les providers globaux
//      (QueryClient pour les requêtes API,
//       BrowserRouter pour la navigation)
//    - Déléguer les routes à AppRouter
//
//  Cette page ne contient aucune logique métier.
// ─────────────────────────────────────────────
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './router';

// Configuration globale de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:               1,       // 1 nouvelle tentative en cas d'erreur réseau
      staleTime:           2 * 60 * 1000, // données considérées fraîches 2 min
      refetchOnWindowFocus: false,  // pas de rechargement au focus de fenêtre
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
