// ─────────────────────────────────────────────
//  Paramètres — styles dans pages/_settings.scss
// ─────────────────────────────────────────────
import { useState }  from 'react';
import { useForm }   from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Shield, Trash2, Eye, EyeOff } from 'lucide-react';
import { useChangePassword }         from '@/features/member/useMember';
import { changePasswordSchema, type ChangePasswordFormData } from '@/utils/schemas';
import { extractApiErrorMessage }    from '@/utils/helpers';
import { Button, Input, Alert, Card } from '@/components/ui';

export function SettingsPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const changePassword = useChangePassword();

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<ChangePasswordFormData>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => reset() }
    );
  };

  const apiError = changePassword.error
    ? extractApiErrorMessage(changePassword.error, 'Mot de passe actuel incorrect.')
    : null;

  return (
    <div className="settings-page">
      <header>
        <h1 className="page-title">Paramètres</h1>
        <p className="page-subtitle">Sécurité et gestion de votre compte.</p>
      </header>

      {/* ── Mot de passe ── */}
      <section aria-labelledby="password-section-title">
        <Card>
          <div className="settings-section-header">
            <div className="settings-section-header__icon"
              style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
              <Lock size={18} aria-hidden="true" />
            </div>
            <div>
              <h2 id="password-section-title" className="settings-section-header__title">
                Changer le mot de passe
              </h2>
              <p className="settings-section-header__sub">
                Utilisez un mot de passe fort et unique, différent de vos autres comptes.
              </p>
            </div>
          </div>

          {changePassword.isSuccess && <Alert variant="success">Mot de passe modifié avec succès.</Alert>}
          {apiError && <Alert variant="error">{apiError}</Alert>}

          <form className="settings-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ position: 'relative' }}>
              <Input
                id="currentPassword"
                label="Mot de passe actuel"
                type={showCurrent ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                autoComplete="current-password"
                error={errors.currentPassword?.message}
                {...register('currentPassword')}
              />
              <button type="button" className="pw-toggle"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? 'Masquer' : 'Afficher'} aria-pressed={showCurrent}>
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <Input
                id="newPassword"
                label="Nouveau mot de passe"
                type={showNew ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                autoComplete="new-password"
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
              <button type="button" className="pw-toggle"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? 'Masquer' : 'Afficher'} aria-pressed={showNew}>
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <Input
              id="confirmPassword"
              label="Confirmer le nouveau mot de passe"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" loading={changePassword.isPending}>
              Modifier le mot de passe
            </Button>
          </form>
        </Card>
      </section>

      {/* ── Infos sécurité ── */}
      <section aria-labelledby="security-info-title">
        <Card>
          <div className="settings-section-header">
            <div className="settings-section-header__icon"
              style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--color-success)' }}>
              <Shield size={18} aria-hidden="true" />
            </div>
            <div>
              <h2 id="security-info-title" className="settings-section-header__title">
                Informations de sécurité
              </h2>
              <p className="settings-section-header__sub">État de la sécurité de votre compte.</p>
            </div>
          </div>
          <dl className="security-list">
            <div className="security-list__item">
              <dt>Authentification</dt>
              <dd>Email + mot de passe</dd>
            </div>
            <div className="security-list__item">
              <dt>Sessions actives</dt>
              <dd>1 session (navigateur actuel)</dd>
            </div>
            <div className="security-list__item">
              <dt>Email vérifié</dt>
              <dd className="is-verified">✓ Vérifié</dd>
            </div>
          </dl>
        </Card>
      </section>

      {/* ── Zone de danger ── */}
      <section aria-labelledby="danger-zone-title">
        <Card style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
          <div className="settings-section-header">
            <div className="settings-section-header__icon"
              style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--color-error)' }}>
              <Trash2 size={18} aria-hidden="true" />
            </div>
            <div>
              <h2 id="danger-zone-title" className="settings-section-header__title"
                style={{ color: 'var(--color-error)' }}>
                Zone de danger
              </h2>
              <p className="settings-section-header__sub">
                Ces actions sont irréversibles. Procédez avec la plus grande prudence.
              </p>
            </div>
          </div>
          <Button variant="danger" aria-label="Supprimer définitivement mon compte">
            Supprimer mon compte
          </Button>
        </Card>
      </section>
    </div>
  );
}
