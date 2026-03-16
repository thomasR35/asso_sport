// ─────────────────────────────────────────────
//  Page d'inscription — styles dans pages/_auth.scss
// ─────────────────────────────────────────────
import { useState } from 'react';
import { Link }     from 'react-router-dom';
import { useForm }  from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Phone, Calendar, Eye, EyeOff, Check, Zap } from 'lucide-react';
import { useRegister }                       from '@/features/auth/useAuth';
import { registerSchema, type RegisterFormData } from '@/utils/schemas';
import { extractApiErrorMessage, PASSWORD_STRENGTH_RULES } from '@/utils/helpers';
import { Button, Input, Alert }              from '@/components/ui';

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

  const passwordValue = watch('password', '');
  const onSubmit = (data: RegisterFormData) => registerMutation.mutate(data);

  const apiError = registerMutation.error
    ? extractApiErrorMessage(registerMutation.error)
    : null;

  return (
    <div className="auth-page" style={{ padding: '40px 24px' }}>
      <div className="auth-page__bg" aria-hidden="true">
        <div className="auth-bg__grid" />
        <div className="auth-bg__glow" />
      </div>

      <article
        className="auth-card"
        style={{ maxWidth: 560 }}
        aria-labelledby="register-title"
      >
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
          {/* ── Identité ── */}
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

          {/* ── Contact ── */}
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

          {/* ── Sécurité ── */}
          <fieldset className="form-section">
            <legend className="form-section__legend">
              <Lock size={14} aria-hidden="true" /> Sécurité
            </legend>

            {/* Mot de passe + indicateur de force */}
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

              {passwordValue && (
                <ul
                  className="pw-strength"
                  role="list"
                  aria-label="Critères du mot de passe"
                >
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

            {/* Confirmation */}
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

          {/* ── CGU ── */}
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
                <Link to="/terms"   target="_blank" rel="noopener noreferrer">conditions générales d'utilisation</Link>
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

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={registerMutation.isPending}
          >
            Créer mon compte
          </Button>
        </form>

        <footer className="auth-card__footer">
          <p>Déjà membre ? <Link to="/login">Se connecter</Link></p>
        </footer>
      </article>
    </div>
  );
}
