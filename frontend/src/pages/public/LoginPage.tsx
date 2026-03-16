// ─────────────────────────────────────────────
//  Page de connexion
//  Logique : useLogin() depuis features/auth
//  Sémantique : <main> > <article> > <form>
// ─────────────────────────────────────────────
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Zap } from 'lucide-react';
import { useLogin } from '@/features/auth/useAuth';
import { loginSchema, type LoginFormData } from '@/utils/schemas';
import { extractApiErrorMessage } from '@/utils/helpers';
import { Button, Input, Alert } from '@/components/ui';

export function LoginPage() {
  const login    = useLogin();
  const location = useLocation();

  // Si on vient d'une page protégée, on l'affiche dans le message
  const cameFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => login.mutate(data);

  const apiError = login.error
    ? extractApiErrorMessage(login.error, 'Identifiants incorrects')
    : null;

  return (
    <>
      <div className="auth-page">
        <div className="auth-page__bg" aria-hidden="true">
          <div className="auth-bg__grid" />
          <div className="auth-bg__glow" />
        </div>

        <article className="auth-card" aria-labelledby="login-title">
          {/* En-tête */}
          <header className="auth-card__header">
            <p className="auth-card__logo" aria-label="AS Dynamo">
              <span className="auth-card__logo-icon" aria-hidden="true">
                <Zap size={18} fill="currentColor" />
              </span>
              AS<strong>DYNAMO</strong>
            </p>
            <h1 id="login-title" className="auth-card__title">Connexion</h1>
            <p className="auth-card__subtitle">
              {cameFrom
                ? 'Connectez-vous pour accéder à cette page.'
                : 'Accédez à votre espace membre.'}
            </p>
          </header>

          {/* Message d'erreur global */}
          {apiError && <Alert variant="error">{apiError}</Alert>}

          {/* Formulaire */}
          <form
            className="auth-card__form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Formulaire de connexion"
          >
            <Input
              id="email"
              label="Adresse email"
              type="email"
              placeholder="vous@exemple.fr"
              icon={<Mail size={16} />}
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                id="password"
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={16} />}
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="auth-card__forgot">
                <Link to="/forgot-password">Mot de passe oublié ?</Link>
              </div>
            </div>

            <Button type="submit" fullWidth size="lg" loading={login.isPending}>
              Se connecter
            </Button>
          </form>

          {/* Lien vers l'inscription */}
          <footer className="auth-card__footer">
            <p>
              Pas encore membre ?{' '}
              <Link to="/register">Adhérer maintenant</Link>
            </p>
          </footer>
        </article>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 64px);
          display: flex; align-items: center; justify-content: center;
          padding: 40px 24px; position: relative; overflow: hidden;
        }
        .auth-page__bg { position: absolute; inset: 0; pointer-events: none; }
        .auth-bg__grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,106,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,106,0,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .auth-bg__glow {
          position: absolute; bottom: -200px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,106,0,0.1) 0%, transparent 70%);
        }
        .auth-card {
          width: 100%; max-width: 440px;
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-xl); padding: 40px;
          position: relative; z-index: 1; box-shadow: var(--shadow-elevated);
          animation: fadeInUp 0.4s ease both;
          display: flex; flex-direction: column; gap: 20px;
        }
        .auth-card__header { display: flex; flex-direction: column; gap: 10px; }
        .auth-card__logo {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-display); font-weight: 900; font-size: 1rem;
          letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text);
        }
        .auth-card__logo-icon {
          width: 32px; height: 32px; background: var(--color-primary);
          border-radius: var(--radius-sm); display: flex; align-items: center;
          justify-content: center; color: #fff;
        }
        .auth-card__title {
          font-family: var(--font-display); font-weight: 900; font-size: 2rem;
          text-transform: uppercase; letter-spacing: 0.02em;
        }
        .auth-card__subtitle { color: var(--color-text-muted); font-size: 0.92rem; }
        .auth-card__form { display: flex; flex-direction: column; gap: 16px; }
        .auth-card__forgot {
          text-align: right; margin-top: 6px;
        }
        .auth-card__forgot a {
          font-size: 0.82rem; color: var(--color-text-muted); text-decoration: none;
          transition: color var(--transition-fast);
        }
        .auth-card__forgot a:hover { color: var(--color-primary); }
        .auth-card__footer {
          text-align: center; font-size: 0.88rem; color: var(--color-text-muted);
          padding-top: 8px; border-top: 1px solid var(--color-border);
        }
        .auth-card__footer a {
          color: var(--color-primary); font-weight: 600; text-decoration: none;
        }
        .auth-card__footer a:hover { text-decoration: underline; }
      `}</style>
    </>
  );
}
