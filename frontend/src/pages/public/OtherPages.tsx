// ─────────────────────────────────────────────
//  Pages secondaires — styles dans pages/_auth.scss
// ─────────────────────────────────────────────
import { useState }     from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm }      from 'react-hook-form';
import { zodResolver }  from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, MailCheck, Zap } from 'lucide-react';
import { forgotPasswordSchema } from '@/utils/schemas';
import { authApi }              from '@/services/api/auth.api';
import { Button, Input, Alert } from '@/components/ui';

// ── Mot de passe oublié ───────────────────────
export function ForgotPasswordPage() {
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } =
    useForm<{ email: string }>({ resolver: zodResolver(forgotPasswordSchema) });

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

        {error && <Alert variant="error">{error}</Alert>}
        {sent  && (
          <Alert variant="success">
            Un lien de réinitialisation a été envoyé si votre adresse est enregistrée.
          </Alert>
        )}

        {!sent && (
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
            <Button type="submit" fullWidth size="lg" loading={loading}>
              Envoyer le lien
            </Button>
          </form>
        )}

        <footer className="auth-card__footer">
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            <ArrowLeft size={14} aria-hidden="true" /> Retour à la connexion
          </Link>
        </footer>
      </article>
    </div>
  );
}

// ── Succès inscription ────────────────────────
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
    </div>
  );
}

// ── Email non vérifié ─────────────────────────
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

// ── 404 ───────────────────────────────────────
export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className="notfound" aria-labelledby="notfound-title">
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
        <div className="notfound__actions">
          <Button variant="secondary" onClick={() => navigate(-1)}>Retour</Button>
          <Button onClick={() => navigate('/')}>Accueil</Button>
        </div>
      </div>
    </main>
  );
}
