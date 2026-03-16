# AS Dynamo — Backend PHP MVC

API REST en PHP 8.2+ suivant le pattern MVC.

---

## 🚀 Installation (5 étapes)

### 1. Installer les dépendances PHP
```bash
cd backend/
composer install
```

### 2. Configurer l'environnement
```bash
# Copier le fichier modèle
cp .env.example .env

# Ouvrir .env et remplir :
# - DB_PASSWORD (votre mot de passe MySQL)
# - JWT_SECRET  (générer avec : php -r "echo bin2hex(random_bytes(32));")
# - MAIL_*      (compte Mailtrap pour les tests d'email)
```

### 3. Créer la base de données
Dans **phpMyAdmin** :
1. Créer une base `as_dynamo`
2. Aller dans l'onglet "Importer"
3. Sélectionner le fichier `database/schema.sql`
4. Cliquer "Importer"

### 4. Configurer le virtual host (XAMPP/Laragon/WAMP)
Pointer le virtual host vers le dossier `backend/public/`.

Avec **Laragon** :
- Le dossier `backend/` dans `C:/laragon/www/` crée automatiquement `backend.test`
- Ou configurer manuellement `http://localhost:8000`

### 5. Vérifier que ça marche
```
GET http://localhost:8000/api/events  →  doit retourner 401 (normal, pas de token)
```

---

## 📁 Structure des dossiers

```
backend/
│
├── public/              ← SEUL dossier exposé sur internet
│   ├── index.php        Point d'entrée unique de toutes les requêtes
│   └── .htaccess        Redirige les URLs vers index.php
│
├── app/                 ← Le cœur de l'application
│   ├── Controllers/     Reçoit la requête → appelle le service → répond JSON
│   │   ├── AuthController.php
│   │   ├── EventController.php
│   │   └── MemberController.php
│   │
│   ├── Services/        Logique métier (règles du jeu)
│   │   ├── AuthService.php     connexion, inscription, tokens
│   │   ├── EventService.php    règles des événements
│   │   ├── MemberService.php   profil, mot de passe
│   │   ├── JwtService.php      création/vérification des tokens JWT
│   │   └── MailService.php     envoi d'emails
│   │
│   ├── Models/          Accès à la base de données (SQL uniquement)
│   │   ├── UserModel.php
│   │   ├── MemberModel.php
│   │   └── EventModel.php
│   │
│   └── Middleware/      Filtres exécutés avant chaque requête
│       ├── AuthMiddleware.php        vérifie le token JWT
│       ├── CorsMiddleware.php        autorise le frontend React
│       └── RateLimitMiddleware.php   bloque la force brute
│
├── config/
│   ├── database.php     Connexion PDO à MySQL
│   └── app.php          Fonctions utilitaires globales
│
├── routes/
│   └── api.php          Toutes les routes de l'API en un seul endroit
│
├── database/
│   └── schema.sql       Script de création des tables (à importer une fois)
│
├── logs/                Logs d'erreurs et rate limiting (ignoré par Git)
├── vendor/              Dépendances Composer (ignoré par Git)
├── .env                 Configuration secrète (ignoré par Git)
├── .env.example         Modèle de configuration (commité sur Git)
└── composer.json        Dépendances PHP
```

---

## 🔄 Comment fonctionne une requête ?

```
Navigateur
    ↓  POST /api/auth/login
public/index.php          ← charge .env, lance CorsMiddleware
    ↓
routes/api.php            ← identifie la route, applique les middlewares
    ↓
AuthMiddleware (si route protégée) ← vérifie le JWT
    ↓
AuthController→login()    ← valide les données de la requête
    ↓
AuthService→login()       ← logique métier (vérifie mdp, crée tokens)
    ↓
UserModel→findByEmail()   ← requête SQL préparée
    ↓
App::jsonResponse()       ← renvoie le JSON au frontend
```

---

## 🔐 Sécurité

| Mécanisme | Détail |
|---|---|
| Mots de passe | Hashés avec `bcrypt` (cost 12) via `password_hash()` |
| Tokens JWT | Access 15 min + Refresh 7 jours en cookie httpOnly |
| Injections SQL | Requêtes préparées PDO partout, aucune interpolation |
| Force brute | Rate limiting : 5 tentatives / 10 min par IP |
| CORS | Uniquement le frontend autorisé (pas `*`) |
| Headers | X-Frame-Options, X-Content-Type-Options, XSS-Protection |
| Erreurs | Messages génériques exposés, détails uniquement en logs |

---

## 📡 Endpoints disponibles

```
POST   /api/auth/login              Connexion
POST   /api/auth/register           Inscription
POST   /api/auth/logout             Déconnexion
POST   /api/auth/refresh            Renouveler le token
GET    /api/auth/verify-email       Vérifier l'email
POST   /api/auth/forgot-password    Demande reset mot de passe
POST   /api/auth/reset-password     Reset mot de passe

GET    /api/events                  Liste des événements  [auth]
GET    /api/events/{id}             Détail d'un événement [auth]
POST   /api/events/{id}/register    S'inscrire            [auth]
DELETE /api/events/{id}/register    Se désinscrire        [auth]

GET    /api/member/profile          Mon profil            [auth]
PUT    /api/member/profile          Modifier mon profil   [auth]
GET    /api/member/events           Mes événements        [auth]
PUT    /api/member/password         Changer mon mot passe [auth]
```
