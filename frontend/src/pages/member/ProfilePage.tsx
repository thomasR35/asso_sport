// ─────────────────────────────────────────────
//  Page profil membre
//  Logique : useMemberProfile + useUpdateProfile
// ─────────────────────────────────────────────
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Calendar, Save } from 'lucide-react';
import { useMemberProfile, useUpdateProfile } from '@/features/member/useMember';
import { Button, Input, Alert, Spinner, Card } from '@/components/ui';
import { getInitials, formatMonthYear } from '@/utils/helpers';

interface ProfileFormData {
  firstName: string;
  lastName:  string;
  phone:     string;
  birthDate: string;
}

export function ProfilePage() {
  const { data: profile, isLoading } = useMemberProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>();

  // Pré-remplir le formulaire quand le profil est chargé
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName:  profile.lastName,
        phone:     profile.phone,
        birthDate: profile.birthDate?.slice(0, 10),
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormData) => updateProfile.mutate(data);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Chargement du profil"
        style={{ display: 'flex', justifyContent: 'center', padding: 80 }}
      >
        <Spinner size={36} />
      </div>
    );
  }

  return (
    <>
      <div className="profile-page">
        <header style={{ animation: 'fadeInUp 0.4s ease both' }}>
          <h1 className="page-title">Mon profil</h1>
          <p className="page-subtitle">Gérez vos informations personnelles.</p>
        </header>

        <div className="profile-layout">
          {/* ── Carte résumé ── */}
          <aside aria-label="Résumé du profil" style={{ animation: 'fadeInUp 0.4s ease 0.05s both' }}>
            <Card className="profile-card">
              <div className="profile-card__avatar" aria-hidden="true">
                {getInitials(profile?.firstName, profile?.lastName)}
              </div>
              <h2 className="profile-card__name">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="profile-card__email">{profile?.email}</p>
              <p className="profile-card__status" role="status">Membre actif</p>
              {profile?.memberSince && (
                <p className="profile-card__since">
                  Membre depuis{' '}
                  <time dateTime={profile.memberSince}>
                    <strong>{formatMonthYear(profile.memberSince)}</strong>
                  </time>
                </p>
              )}
            </Card>
          </aside>

          {/* ── Formulaire de modification ── */}
          <section aria-labelledby="edit-profile-title" style={{ flex: 1, animation: 'fadeInUp 0.4s ease 0.1s both' }}>
            <Card>
              <h2 id="edit-profile-title" className="section-heading">
                Informations personnelles
              </h2>

              {updateProfile.isSuccess && (
                <Alert variant="success">Profil mis à jour avec succès.</Alert>
              )}
              {updateProfile.isError && (
                <Alert variant="error">Une erreur est survenue. Veuillez réessayer.</Alert>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-label="Modifier le profil"
                className="profile-form"
              >
                <div className="form-row">
                  <Input
                    id="firstName"
                    label="Prénom"
                    icon={<User size={16} />}
                    error={errors.firstName?.message}
                    {...register('firstName', {
                      required: 'Champ requis',
                      minLength: { value: 2, message: 'Trop court' },
                    })}
                  />
                  <Input
                    id="lastName"
                    label="Nom"
                    icon={<User size={16} />}
                    error={errors.lastName?.message}
                    {...register('lastName', {
                      required: 'Champ requis',
                      minLength: { value: 2, message: 'Trop court' },
                    })}
                  />
                </div>

                <Input
                  id="email-display"
                  label="Email"
                  type="email"
                  icon={<Mail size={16} />}
                  value={profile?.email ?? ''}
                  disabled
                  hint="L'adresse email ne peut pas être modifiée ici."
                  onChange={() => {}}
                  aria-readonly="true"
                />

                <Input
                  id="phone"
                  label="Téléphone"
                  type="tel"
                  icon={<Phone size={16} />}
                  error={errors.phone?.message}
                  {...register('phone', {
                    pattern: { value: /^(\+33|0)[1-9](\d{8})$/, message: 'Numéro invalide' },
                  })}
                />

                <Input
                  id="birthDate"
                  label="Date de naissance"
                  type="date"
                  icon={<Calendar size={16} />}
                  error={errors.birthDate?.message}
                  {...register('birthDate')}
                />

                <Button
                  type="submit"
                  loading={updateProfile.isPending}
                  disabled={!isDirty}
                  aria-describedby={!isDirty ? 'no-changes-hint' : undefined}
                >
                  <Save size={16} aria-hidden="true" /> Enregistrer les modifications
                </Button>
                {!isDirty && (
                  <p id="no-changes-hint" className="sr-only">
                    Aucune modification détectée.
                  </p>
                )}
              </form>
            </Card>
          </section>
        </div>
      </div>

      <style>{`
        .profile-page   { display: flex; flex-direction: column; gap: 28px; }
        .page-title     { font-family: var(--font-display); font-weight: 900; font-size: 2rem; text-transform: uppercase; letter-spacing: 0.02em; }
        .page-subtitle  { color: var(--color-text-muted); font-size: 0.92rem; margin-top: 4px; }
        .profile-layout { display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; }
        .profile-card   { width: 240px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
        .profile-card__avatar {
          width: 72px; height: 72px; border-radius: var(--radius-lg); margin-bottom: 6px;
          background: var(--color-primary); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-weight: 900; font-size: 1.5rem;
        }
        .profile-card__name   { font-family: var(--font-display); font-weight: 900; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.03em; }
        .profile-card__email  { font-size: 0.82rem; color: var(--color-text-muted); }
        .profile-card__status {
          padding: 4px 12px; border-radius: 999px;
          background: rgba(34,197,94,0.12); color: var(--color-success);
          border: 1px solid rgba(34,197,94,0.3);
          font-family: var(--font-display); font-weight: 700; font-size: 0.72rem;
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .profile-card__since  { font-size: 0.82rem; color: var(--color-text-muted); }
        .section-heading      { font-family: var(--font-display); font-weight: 800; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px; }
        .profile-form         { display: flex; flex-direction: column; gap: 18px; }
        .form-row             { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 700px) {
          .profile-layout { flex-direction: column; }
          .profile-card   { width: 100%; }
          .form-row       { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
