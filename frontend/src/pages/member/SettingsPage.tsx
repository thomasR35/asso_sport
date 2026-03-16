// ─────────────────────────────────────────────
//  Page paramètres membre
//  Logique : useChangePassword depuis features/member
// ─────────────────────────────────────────────
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Shield, Trash2, Eye, EyeOff } from 'lucide-react';
import { useChangePassword } from '@/features/member/useMember';
import { changePasswordSchema, type ChangePasswordFormData } from '@/utils/schemas';
import { extractApiErrorMessage } from '@/utils/helpers';
import { Button, Input, Alert, Card } from '@/components/ui';

export function SettingsPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);

  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => reset() }
    );
  };

  const changePasswordError = changePassword.error
    ? extractApiErrorMessage(changePassword.error, 'Mot de passe actuel incorrect.')
    : null;

  return (
    <>
      <div className="settings-page">
        <header style={{ animation: 'fadeInUp 0.4s ease both' }}>
          <h1 className="page-title">Paramètres</h1>
          <p className="page-subtitle">Sécurité et gestion de votre compte.</p>
        </header>

        {/* ── Changement de mot de passe ── */}
        <section aria-labelledby="password-section-title" style={{ animation: 'fadeInUp 0.4s ease 0.1s both' }}>
          <Card>
            <header className="settings-section-header">
              <div className="settings-section-header__icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
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
            </header>

            {changePassword.isSuccess && (
              <Alert variant="success">Mot de passe modifié avec succès.</Alert>
            )}
            {changePasswordError && (
              <Alert variant="error">{changePasswordError}</Alert>
            )}

            <form
              className="settings-form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label="Modifier le mot de passe"
            >
              {/* Mot de passe actuel */}
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
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowCurrent(!showCurrent)}
                  aria-label={showCurrent ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  aria-pressed={showCurrent}
                >
                  {showCurrent ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                </button>
              </div>

              {/* Nouveau mot de passe */}
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
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowNew(!showNew)}
                  aria-label={showNew ? 'Masquer le nouveau mot de passe' : 'Afficher le nouveau mot de passe'}
                  aria-pressed={showNew}
                >
                  {showNew ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
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

        {/* ── Informations de sécurité ── */}
        <section aria-labelledby="security-info-title" style={{ animation: 'fadeInUp 0.4s ease 0.15s both' }}>
          <Card>
            <header className="settings-section-header">
              <div className="settings-section-header__icon" style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--color-success)' }}>
                <Shield size={18} aria-hidden="true" />
              </div>
              <div>
                <h2 id="security-info-title" className="settings-section-header__title">
                  Informations de sécurité
                </h2>
                <p className="settings-section-header__sub">État de la sécurité de votre compte.</p>
              </div>
            </header>

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
                <dd style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                  ✓ Vérifié
                </dd>
              </div>
            </dl>
          </Card>
        </section>

        {/* ── Zone de danger ── */}
        <section
          aria-labelledby="danger-zone-title"
          style={{ animation: 'fadeInUp 0.4s ease 0.2s both' }}
        >
          <Card style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
            <header className="settings-section-header">
              <div className="settings-section-header__icon" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--color-error)' }}>
                <Trash2 size={18} aria-hidden="true" />
              </div>
              <div>
                <h2 id="danger-zone-title" className="settings-section-header__title" style={{ color: 'var(--color-error)' }}>
                  Zone de danger
                </h2>
                <p className="settings-section-header__sub">
                  Ces actions sont irréversibles. Procédez avec la plus grande prudence.
                </p>
              </div>
            </header>
            <Button variant="danger" aria-label="Supprimer définitivement mon compte">
              Supprimer mon compte
            </Button>
          </Card>
        </section>
      </div>

      <style>{`
        .settings-page { display: flex; flex-direction: column; gap: 24px; }
        .page-title    { font-family: var(--font-display); font-weight: 900; font-size: 2rem; text-transform: uppercase; letter-spacing: 0.02em; }
        .page-subtitle { color: var(--color-text-muted); font-size: 0.92rem; margin-top: 4px; }

        .settings-section-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
        .settings-section-header__icon {
          width: 44px; height: 44px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .settings-section-header__title {
          font-family: var(--font-display); font-weight: 800; font-size: 1rem;
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;
        }
        .settings-section-header__sub { color: var(--color-text-muted); font-size: 0.88rem; }

        .settings-form { display: flex; flex-direction: column; gap: 16px; }
        .pw-toggle {
          position: absolute; right: 12px; top: 36px;
          color: var(--color-text-dim); background: none; border: none; cursor: pointer;
          display: flex; align-items: center; transition: color var(--transition-fast);
        }
        .pw-toggle:hover { color: var(--color-text); }

        .security-list { display: flex; flex-direction: column; }
        .security-list__item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0; border-bottom: 1px solid var(--color-border);
        }
        .security-list__item:last-child { border-bottom: none; }
        .security-list__item dt {
          font-family: var(--font-display); font-weight: 700;
          font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase;
          color: var(--color-text-muted);
        }
        .security-list__item dd { font-size: 0.88rem; font-weight: 500; margin: 0; }
      `}</style>
    </>
  );
}
