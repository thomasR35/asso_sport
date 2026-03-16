// ─────────────────────────────────────────────
//  Page d'inscription
//  Logique : useRegister() depuis features/auth
//  Sémantique : <form> avec <fieldset>/<legend>
// ─────────────────────────────────────────────
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Phone, Calendar, Eye, EyeOff, Check, Zap } from 'lucide-react';
import { useRegister } from '@/features/auth/useAuth';
import { registerSchema, type RegisterFormData } from '@/utils/schemas';
import { extractApiErrorMessage, PASSWORD_STRENGTH_RULES } from '@/utils/helpers';
import { Button, Input, Alert } from '@/components/ui';

export function RegisterPage() {
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // On surveille le champ mot de passe pour l'indicateur de force
  const passwordValue = watch('password', '');

  const onSubmit = (data: RegisterFormData) => registerMutation.mutate(data);

  const apiError = registerMutation.error
    ? extractApiErrorMessage(registerMutation.error)
    : null;

  return (
    <>
      <div className="auth-page" style={{ padding: '40px 24px' }}>
        <div className="auth-page__bg" aria-hidden="true">
          <div className="auth-bg__grid" />
          <div className="auth-bg__glow" />
        </div>

        <article className="auth-card" style={{ maxWidth: 560 }} aria-labelledby="register-title">
          <header className="auth-card__header">
            <p className="auth-card__logo" aria-label="AS Dynamo">
              <span className="auth-card__logo-icon" aria-hidden="true">
                <Zap size={18} fill="currentColor" />
              </span>
              AS<strong>DYNAMO</strong>
            </p>
            <h1 id="register-title" className="auth-card__title">Adhésion</h1>
            <p className="auth-card__subtitle">
              Créez votre compte pour rejoindre l'association.
            </p>
          </header>

          {apiError && <Alert variant="error">{apiError}</Alert>}

          <form
            className="auth-card__form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Formulaire d'inscription"
          >
            {/* ── Section : Identité ── */}
            <fieldset className="form-section">
              <legend className="form-section__legend">
                <User size={14} aria-hidden="true" /> Identité
              </legend>

              <div className="form-row">
                <Input
                  id="firstName"
                  label="Prénom"
                  placeholder="Jean"
                  autoComplete="given-name"
                  icon={<User size={16} />}
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  id="lastName"
                  label="Nom"
                  placeholder="Dupont"
                  autoComplete="family-name"
                  icon={<User size={16} />}
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <Input
                id="birthDate"
                label="Date de naissance"
                type="date"
                autoComplete="bday"
                icon={<Calendar size={16} />}
                error={errors.birthDate?.message}
                {...register('birthDate')}
              />
            </fieldset>

            {/* ── Section : Contact ── */}
            <fieldset className="form-section">
              <legend className="form-section__legend">
                <Mail size={14} aria-hidden="true" /> Contact
              </legend>

              <Input
                id="email"
                label="Adresse email"
                type="email"
                placeholder="vous@exemple.fr"
                autoComplete="email"
                icon={<Mail size={16} />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                id="phone"
                label="Téléphone"
                type="tel"
                placeholder="06 12 34 56 78"
                autoComplete="tel"
                icon={<Phone size={16} />}
                hint="Format : 06XXXXXXXX ou +336XXXXXXXX"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </fieldset>

            {/* ── Section : Sécurité ── */}
            <fieldset className="form-section">
              <legend className="form-section__legend">
                <Lock size={14} aria-hidden="true" /> Sécurité
              </legend>

              {/* Mot de passe avec indicateur de force */}
              <div className="pw-field">
                <div style={{ position: 'relative' }}>
                  <Input
                    id="password"
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    icon={<Lock size={16} />}
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    aria-pressed={showPassword}
                  >
                    {showPassword
                      ? <EyeOff size={15} aria-hidden="true" />
                      : <Eye    size={15} aria-hidden="true" />
                    }
                  </button>
                </div>

                {/* Indicateur de force — affiché seulement si on tape */}
                {passwordValue && (
                  <ul className="pw-strength" role="list" aria-label="Critères du mot de passe">
                    {PASSWORD_STRENGTH_RULES.map((rule) => (
                      <li
                        key={rule.label}
                        className={`pw-strength__rule ${rule.test(passwordValue) ? 'pw-strength__rule--ok' : ''}`}
                        aria-label={`${rule.label} : ${rule.test(passwordValue) ? 'validé' : 'non validé'}`}
                      >
                        <Check size={11} aria-hidden="true" />
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Confirmation du mot de passe */}
              <div style={{ position: 'relative' }}>
                <Input
                  id="confirmPassword"
                  label="Confirmer le mot de passe"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  icon={<Lock size={16} />}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Masquer la confirmation' : 'Afficher la confirmation'}
                  aria-pressed={showConfirm}
                >
                  {showConfirm
                    ? <EyeOff size={15} aria-hidden="true" />
                    : <Eye    size={15} aria-hidden="true" />
                  }
                </button>
              </div>
            </fieldset>

            {/* ── Acceptation des CGU ── */}
            <div className="cgu-block">
              <label className="cgu-label">
                <input
                  type="checkbox"
                  className="cgu-label__checkbox"
                  aria-describedby="cgu-error"
                  {...register('acceptTerms')}
                />
                <span className="cgu-label__box" aria-hidden="true">
                  <Check size={11} />
                </span>
                <span>
                  J'accepte les{' '}
                  <Link to="/terms" target="_blank" rel="noopener noreferrer">conditions générales d'utilisation</Link>
                  {' '}et la{' '}
                  <Link to="/privacy" target="_blank" rel="noopener noreferrer">politique de confidentialité</Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p id="cgu-error" className="field__error" role="alert">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            <Button type="submit" fullWidth size="lg" loading={registerMutation.isPending}>
              Créer mon compte
            </Button>
          </form>

          <footer className="auth-card__footer">
            <p>Déjà membre ? <Link to="/login">Se connecter</Link></p>
          </footer>
        </article>
      </div>

      <style>{`
        .form-section {
          border: 1px solid var(--color-border); border-radius: var(--radius-md);
          padding: 20px; display: flex; flex-direction: column; gap: 14px;
          background: var(--color-bg-2);
        }
        .form-section__legend {
          display: flex; align-items: center; gap: 7px;
          font-family: var(--font-display); font-weight: 800; font-size: 0.72rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-primary);
          padding: 0 4px;
        }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .pw-field { display: flex; flex-direction: column; gap: 8px; }
        .pw-toggle {
          position: absolute; right: 12px; top: 36px;
          color: var(--color-text-dim); background: none; border: none;
          cursor: pointer; display: flex; align-items: center;
          transition: color var(--transition-fast);
        }
        .pw-toggle:hover { color: var(--color-text); }

        .pw-strength {
          display: flex; flex-wrap: wrap; gap: 6px;
          list-style: none; padding: 0; margin: 0;
        }
        .pw-strength__rule {
          display: flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: 999px; font-size: 0.72rem; font-weight: 600;
          background: var(--color-bg-elevated); color: var(--color-text-dim);
          border: 1px solid var(--color-border); transition: all var(--transition-fast);
        }
        .pw-strength__rule--ok {
          background: rgba(34,197,94,0.12); color: var(--color-success);
          border-color: rgba(34,197,94,0.3);
        }

        .cgu-block { display: flex; flex-direction: column; gap: 6px; }
        .cgu-label {
          display: flex; align-items: flex-start; gap: 10px;
          cursor: pointer; font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.5;
        }
        .cgu-label__checkbox { display: none; }
        .cgu-label__box {
          width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;
          border: 2px solid var(--color-border); border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          color: transparent; background: var(--color-bg-card);
          transition: all var(--transition-fast);
        }
        .cgu-label__checkbox:checked ~ .cgu-label__box {
          background: var(--color-primary); border-color: var(--color-primary); color: #fff;
        }
        .cgu-label a { color: var(--color-primary); text-decoration: none; font-weight: 600; }
        .cgu-label a:hover { text-decoration: underline; }

        .field__error { font-size: 0.78rem; color: var(--color-error); font-weight: 500; }

        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
