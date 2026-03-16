// ─────────────────────────────────────────────
//  Règles de validation des formulaires (Zod)
//  Ces schémas sont partagés entre les pages et
//  les hooks — une seule source de vérité.
// ─────────────────────────────────────────────
import { z } from 'zod';

// Règle réutilisable pour les mots de passe forts
const strongPassword = z
  .string()
  .min(8, 'Minimum 8 caractères')
  .regex(/[A-Z]/, 'Au moins une majuscule')
  .regex(/[a-z]/, 'Au moins une minuscule')
  .regex(/[0-9]/, 'Au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial');

// ── Connexion ─────────────────────────────────
export const loginSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

// ── Inscription ───────────────────────────────
export const registerSchema = z
  .object({
    firstName:       z.string().min(2, 'Prénom trop court').max(50),
    lastName:        z.string().min(2, 'Nom trop court').max(50),
    email:           z.string().email('Email invalide'),
    phone:           z.string().regex(/^(\+33|0)[1-9](\d{8})$/, 'Numéro invalide'),
    birthDate:       z.string().refine((d) => {
      const age = (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 16 && age <= 120;
    }, 'Vous devez avoir au moins 16 ans'),
    password:        strongPassword,
    confirmPassword: z.string(),
    acceptTerms:     z.literal(true, {
      errorMap: () => ({ message: 'Vous devez accepter les CGU' }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path:    ['confirmPassword'],
    message: 'Les mots de passe ne correspondent pas',
  });

// ── Mot de passe oublié ───────────────────────
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

// ── Réinitialisation de mot de passe ─────────
export const resetPasswordSchema = z
  .object({
    password:        strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path:    ['confirmPassword'],
    message: 'Les mots de passe ne correspondent pas',
  });

// ── Changement de mot de passe (espace membre) ──
export const changePasswordSchema = z
  .object({
    currentPassword:  z.string().min(1, 'Mot de passe actuel requis'),
    newPassword:      strongPassword,
    confirmPassword:  z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path:    ['confirmPassword'],
    message: 'Les mots de passe ne correspondent pas',
  });

// ── Types inférés ─────────────────────────────
export type LoginFormData          = z.infer<typeof loginSchema>;
export type RegisterFormData       = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
