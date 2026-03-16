// ─────────────────────────────────────────────
//  Profil membre — styles dans pages/_profile.scss
// ─────────────────────────────────────────────
import { useEffect } from 'react';
import { useForm }   from 'react-hook-form';
import { User, Mail, Phone, Calendar, Save } from 'lucide-react';
import { useMemberProfile, useUpdateProfile } from '@/features/member/useMember';
import { Button, Input, Alert, Spinner, Card } from '@/components/ui';
import { getInitials, formatMonthYear }        from '@/utils/helpers';
import { extractApiErrorMessage }              from '@/utils/helpers';

interface ProfileFormData {
  firstName: string;
  lastName:  string;
  phone:     string;
  birthDate: string;
}

export function ProfilePage() {
  const { data: profile, isLoading } = useMemberProfile();
  const updateProfile = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } =
    useForm<ProfileFormData>();

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

  const apiError = updateProfile.error
    ? extractApiErrorMessage(updateProfile.error)
    : null;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }} role="status">
        <Spinner size={36} />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header style={{ animation: 'fadeInUp 0.4s ease both' }}>
        <h1 className="page-title">Mon profil</h1>
        <p className="page-subtitle">Gérez vos informations personnelles.</p>
      </header>

      <div className="profile-layout">
        <aside aria-label="Résumé du profil">
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

        <section aria-labelledby="edit-profile-title" style={{ flex: 1 }}>
          <Card>
            <h2 id="edit-profile-title" className="section-heading">
              Informations personnelles
            </h2>

            {updateProfile.isSuccess && (
              <Alert variant="success">Profil mis à jour avec succès.</Alert>
            )}
            {apiError && <Alert variant="error">{apiError}</Alert>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="profile-form">
              <div className="profile-form__row">
                <Input
                  id="firstName"
                  label="Prénom"
                  icon={<User size={16} />}
                  error={errors.firstName?.message}
                  {...register('firstName', { required: 'Champ requis', minLength: { value: 2, message: 'Trop court' } })}
                />
                <Input
                  id="lastName"
                  label="Nom"
                  icon={<User size={16} />}
                  error={errors.lastName?.message}
                  {...register('lastName', { required: 'Champ requis', minLength: { value: 2, message: 'Trop court' } })}
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
              <Button type="submit" loading={updateProfile.isPending} disabled={!isDirty}>
                <Save size={16} aria-hidden="true" /> Enregistrer les modifications
              </Button>
            </form>
          </Card>
        </section>
      </div>
    </div>
  );
}
