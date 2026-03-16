# 🏃 AS Dynamo — Frontend React (v2)

Site web de l'association sportive fictive AS Dynamo.  
Stack : **Vite + React + TypeScript**

---

## 🚀 Installation et démarrage

```bash
npm install
npm run dev
```

Le frontend tourne sur `http://localhost:5173`.  
Les appels `/api` sont automatiquement redirigés vers `http://localhost:8000` (backend PHP).

---

## 📁 Structure du projet — à lire en premier

```
src/
│
├── components/            ← Blocs visuels réutilisables (pas de logique métier)
│   ├── auth/
│   │   └── ProtectedRoute.tsx       Redirige vers /login si non connecté
│   ├── layout/
│   │   ├── Navbar.tsx               Barre de navigation publique
│   │   ├── Footer.tsx               Pied de page
│   │   ├── PublicLayout.tsx         Structure : Navbar + contenu + Footer
│   │   └── MemberLayout.tsx         Structure : Sidebar + contenu principal
│   └── ui/
│       └── index.tsx                Button, Input, Badge, Alert, Spinner, Card
│
├── features/              ← Logique métier par domaine (hooks + store)
│   ├── auth/
│   │   ├── authStore.ts             État de session (qui est connecté, token)
│   │   └── useAuth.ts               useLogin / useRegister / useLogout
│   ├── events/
│   │   └── useEvents.ts             useEvents / useRegisterToEvent / etc.
│   └── member/
│       └── useMember.ts             useMemberProfile / useUpdateProfile / etc.
│
├── services/              ← Communication avec le backend
│   └── api/
│       ├── apiClient.ts             Instance Axios + refresh silencieux JWT
│       ├── auth.api.ts              Endpoints : login, register, logout...
│       ├── events.api.ts            Endpoints : getAll, register, unregister...
│       └── member.api.ts            Endpoints : profile, password...
│
├── pages/                 ← Pages complètes = composants + 1 feature max
│   ├── public/
│   │   ├── HomePage.tsx             Accueil avec héro, stats, avantages
│   │   ├── LoginPage.tsx            Connexion
│   │   ├── RegisterPage.tsx         Inscription
│   │   └── OtherPages.tsx           ForgotPassword, RegisterSuccess, 404...
│   └── member/
│       ├── DashboardPage.tsx        Tableau de bord
│       ├── CalendarPage.tsx         FullCalendar + inscription aux événements
│       ├── ProfilePage.tsx          Modifier les infos personnelles
│       └── SettingsPage.tsx         Sécurité, mot de passe, zone de danger
│
├── types/
│   └── index.ts                     Types TypeScript partagés
│
├── utils/
│   ├── schemas.ts                   Règles de validation Zod
│   └── helpers.ts                   Fonctions utilitaires pures + constantes
│
├── router.tsx             ← Toutes les routes en un seul endroit
├── App.tsx                ← Providers globaux (QueryClient, BrowserRouter)
└── main.tsx               ← Point d'entrée — monte React dans le DOM
```

---

## 🧱 Règle d'or : séparation des responsabilités

```
Page  →  appelle un hook (features/)
       →  qui appelle un service (services/api/)
       →  qui parle au backend PHP
```

**Ce qu'une page fait** : assembler des composants, appeler UN hook métier, gérer l'affichage.  
**Ce qu'une page ne fait PAS** : appeler directement l'API, gérer le store, contenir du business logic.

---

## 🔐 Sécurité frontend

| Mécanisme | Implémentation |
|---|---|
| Access Token JWT | sessionStorage via Zustand (disparaît à la fermeture du navigateur) |
| Refresh Token | Cookie httpOnly géré côté serveur PHP |
| Refresh silencieux | Intercepteur Axios — file d'attente si plusieurs requêtes simultanées |
| Route protégée | `ProtectedRoute` → redirect `/login` + mémorisation de la destination |
| Email non vérifié | Redirect vers `/verify-email-notice` |
| Validation formulaires | Zod côté client — schémas dans `utils/schemas.ts` |
| Messages d'erreur | Génériques côté client — pas de fuite d'info interne |

---

## ♿ Accessibilité (sémantique HTML)

- `<header role="banner">`, `<main id="main-content">`, `<footer role="contentinfo">`
- `<nav aria-label="...">` pour chaque zone de navigation distincte
- `<ul>/<li>` pour toutes les listes de liens et de cartes
- `<fieldset>/<legend>` dans les formulaires multi-sections
- `<dl>/<dt>/<dd>` pour les listes de définitions (méta-données événement)
- `aria-current="page"` sur le lien actif
- `aria-expanded` sur les boutons toggle (menu mobile, sidebar)
- `aria-label` et `aria-pressed` sur les boutons icône
- `role="alert"` sur les erreurs de formulaire
- `role="status"` sur les indicateurs de statut
- `<time dateTime="...">` sur toutes les dates

---

## 🔗 Endpoints backend attendus

```
POST /api/auth/login              → { user, accessToken }
POST /api/auth/register           → { message }
POST /api/auth/logout             → 200
POST /api/auth/refresh            → { accessToken }
GET  /api/auth/verify-email       → 200
POST /api/auth/forgot-password    → 200
POST /api/auth/reset-password     → 200

GET  /api/events                  → SportEvent[]
GET  /api/events/:id              → SportEvent
POST /api/events/:id/register     → 200
DEL  /api/events/:id/register     → 200

GET  /api/member/profile          → MemberProfile
PUT  /api/member/profile          → MemberProfile
GET  /api/member/events           → SportEvent[]
PUT  /api/member/password         → 200
```
