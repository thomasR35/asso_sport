// ─────────────────────────────────────────────
//  Pages secondaires publiques
//    - Mot de passe oublié
//    - Succès inscription
//    - Email non vérifié
//    - 404
// ─────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, MailCheck, Zap } from 'lucide-react';
import { forgotPasswordSchema } from '@/utils/schemas';
import { authApi } from '@/services/api/auth.api';
import { Button, Input, Alert } from '@/components/ui';

// ══════════════════════════════════════════════
//  Mot de passe oublié
// ══════════════════════════════════════════════
export function ForgotPasswordPage() {
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true); setError(null);
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-page__bg" aria-hidden="true">
          <div className="auth-bg__grid" />
          <div className="auth-bg__glow" />
        </div>

        <article className="auth-card" aria-labelledby="forgot-title">
          <header className="auth-card__header">
            <p className="auth-card__logo" aria-label="AS Dynamo">
              <span className="auth-card__logo-icon" aria-hidden="true">
                <Zap size={18} fill="currentColor" />
              </span>
              AS<strong>DYNAMO</strong>
            </p>
            <h1 id="forgot-title" className="auth-card__title">Mot de passe oublié</h1>
            <p className="auth-card__subtitle">
              Saisissez votre email pour recevoir un lien de réinitialisation.
            </p>
          </header>

          {error  && <Alert variant="error">{error}</Alert>}
          {sent   && (
            <Alert variant="success">
              Un lien de réinitialisation a été envoyé si votre adresse est enregistrée.
            </Alert>
          )}

          {!sent && (
            <form
              className="auth-card__form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label="Formulaire de réinitialisation"
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
              <Button type="submit" fullWidth size="lg" loading={loading}>
                Envoyer le lien
              </Button>
            </form>
          )}

          <footer className="auth-card__footer">
            <Link
              to="/login"
              style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.88rem' }}
            >
              <ArrowLeft size={14} aria-hidden="true" /> Retour à la connexion
            </Link>
          </footer>
        </article>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════
//  Succès inscription — email envoyé
// ══════════════════════════════════════════════
export function RegisterSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-page__bg" aria-hidden="true">
        <div className="auth-bg__grid" />
        <div className="auth-bg__glow" />
      </div>

      <article className="info-card" aria-labelledby="success-title">
        <div className="info-card__icon info-card__icon--success" aria-hidden="true">
          <MailCheck size={32} />
        </div>

        <header>
          <h1 id="success-title" className="info-card__title">Compte créé !</h1>
        </header>

        <p className="info-card__text">
          Votre demande d'adhésion a été enregistrée. Un email de confirmation
          vous a été envoyé — cliquez sur le lien pour activer votre compte.
        </p>

        <aside className="info-card__note" role="note">
          <Zap size={14} fill="currentColor" aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
          Vérifiez vos spams si vous ne trouvez pas l'email.
        </aside>

        <Button variant="secondary" onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
      </article>

      <style>{`
        .info-card {
          width: 100%; max-width: 440px;
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-xl); padding: 48px 40px;
          display: flex; flex-direction: column; align-items: center;
          gap: 20px; text-align: center;
          position: relative; z-index: 1; box-shadow: var(--shadow-elevated);
          animation: fadeInUp 0.4s ease both;
        }
        .info-card__icon {
          width: 72px; height: 72px; border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
        }
        .info-card__icon--success {
          background: rgba(34,197,94,0.12); color: var(--color-success);
          border: 1px solid rgba(34,197,94,0.3);
        }
        .info-card__title {
          font-family: var(--font-display); font-weight: 900; font-size: 1.8rem;
          text-transform: uppercase; letter-spacing: 0.02em;
        }
        .info-card__text { color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; }
        .info-card__note {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 16px; border-radius: var(--radius-md);
          background: rgba(255,106,0,0.08); border: 1px solid rgba(255,106,0,0.2);
          color: var(--color-text-muted); font-size: 0.82rem;
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════
//  Email non vérifié
// ══════════════════════════════════════════════
export function VerifyEmailNoticePage() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <div className="auth-page__bg" aria-hidden="true">
        <div className="auth-bg__grid" />
        <div className="auth-bg__glow" />
      </div>
      <article className="info-card" aria-labelledby="verify-title">
        <div className="info-card__icon info-card__icon--success" aria-hidden="true">
          <MailCheck size={32} />
        </div>
        <header>
          <h1 id="verify-title" className="info-card__title">Email non vérifié</h1>
        </header>
        <p className="info-card__text">
          Votre adresse email n'a pas encore été vérifiée. Consultez vos emails
          et cliquez sur le lien de confirmation pour accéder à votre espace membre.
        </p>
        <Button onClick={() => navigate('/login')}>Retour à la connexion</Button>
      </article>
    </div>
  );
}

// ══════════════════════════════════════════════
//  Page 404
// ══════════════════════════════════════════════
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="notfound" role="main" aria-labelledby="notfound-title">
        <div className="auth-page__bg" aria-hidden="true">
          <div className="auth-bg__grid" />
        </div>

        <div className="notfound__content">
          <div className="notfound__icon" aria-hidden="true">
            <Zap size={32} fill="currentColor" />
          </div>

          <p className="notfound__code" aria-label="Erreur 404">404</p>
          <h1 id="notfound-title" className="notfound__title">Page introuvable</h1>
          <p className="notfound__description">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="secondary" onClick={() => navigate(-1)}>Retour</Button>
            <Button onClick={() => navigate('/')}>Accueil</Button>
          </div>
        </div>
      </div>

      <style>{`
        .notfound {
          min-height: calc(100vh - 64px); display: flex; align-items: center;
          justify-content: center; padding: 40px; position: relative; overflow: hidden;
        }
        .notfound__content {
          position: relative; z-index: 1; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          animation: fadeInUp 0.4s ease both;
        }
        .notfound__icon {
          width: 64px; height: 64px; background: rgba(255,106,0,0.12);
          border: 1px solid rgba(255,106,0,0.3); border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-primary);
        }
        .notfound__code {
          font-family: var(--font-display); font-weight: 900; font-size: 8rem;
          line-height: 1; color: var(--color-primary); letter-spacing: -0.04em;
        }
        .notfound__title {
          font-family: var(--font-display); font-weight: 900; font-size: 1.8rem;
          text-transform: uppercase; letter-spacing: 0.04em;
        }
        .notfound__description { color: var(--color-text-muted); max-width: 360px; }
      `}</style>
    </>
  );
}
