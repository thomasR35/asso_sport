// ─────────────────────────────────────────────
//  Page de connexion — styles dans pages/_auth.scss
// ─────────────────────────────────────────────
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Zap } from 'lucide-react';
import { useLogin }                   from '@/features/auth/useAuth';
import { loginSchema, type LoginFormData } from '@/utils/schemas';
import { extractApiErrorMessage }     from '@/utils/helpers';
import { Button, Input, Alert }       from '@/components/ui';

export function LoginPage() {
  const login    = useLogin();
  const location = useLocation();
  const cameFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit  = (data: LoginFormData) => login.mutate(data);
  const apiError  = login.error
    ? extractApiErrorMessage(login.error, 'Identifiants incorrects')
    : null;

  return (
    <div className="auth-page">
      <div className="auth-page__bg" aria-hidden="true">
        <div className="auth-bg__grid" />
        <div className="auth-bg__glow" />
      </div>

      <article className="auth-card" aria-labelledby="login-title">
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
              : 'Accédez à votre espace membre.'
            }
          </p>
        </header>

        {apiError && <Alert variant="error">{apiError}</Alert>}

        <form className="auth-card__form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

        <footer className="auth-card__footer">
          <p>Pas encore membre ? <Link to="/register">Adhérer maintenant</Link></p>
        </footer>
      </article>
    </div>
  );
}
