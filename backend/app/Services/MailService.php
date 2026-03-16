<?php

// ──────────────────────────────────────────────
//  Service d'envoi d'emails (PHPMailer)
//
//  Responsabilités :
//  - Envoyer l'email de confirmation d'inscription
//  - Envoyer l'email de réinitialisation du mot de passe
// ──────────────────────────────────────────────

declare(strict_types=1);

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailService
{
    /**
     * Envoie un email de confirmation d'inscription.
     * L'utilisateur doit cliquer sur le lien pour activer son compte.
     */
    public function sendEmailVerification(string $toEmail, string $toName, string $token): bool
    {
        $verificationUrl = $_ENV['APP_URL'] . '/api/auth/verify-email?token=' . $token;

        $subject = 'Confirmez votre inscription — ' . $_ENV['APP_NAME'];

        $body = "
            <h2>Bienvenue chez {$_ENV['APP_NAME']} !</h2>
            <p>Bonjour {$toName},</p>
            <p>Cliquez sur le lien ci-dessous pour activer votre compte :</p>
            <p><a href='{$verificationUrl}' style='background:#ff6a00;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;'>
                Activer mon compte
            </a></p>
            <p>Ce lien expire dans 24 heures.</p>
            <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
        ";

        return $this->send($toEmail, $toName, $subject, $body);
    }

    /**
     * Envoie un email de réinitialisation du mot de passe.
     */
    public function sendPasswordReset(string $toEmail, string $toName, string $token): bool
    {
        $resetUrl = $_ENV['FRONTEND_URL'] . '/reset-password?token=' . $token;

        $subject = 'Réinitialisation de votre mot de passe — ' . $_ENV['APP_NAME'];

        $body = "
            <h2>Réinitialisation de votre mot de passe</h2>
            <p>Bonjour {$toName},</p>
            <p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :</p>
            <p><a href='{$resetUrl}' style='background:#ff6a00;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;'>
                Réinitialiser mon mot de passe
            </a></p>
            <p>Ce lien expire dans 1 heure.</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        ";

        return $this->send($toEmail, $toName, $subject, $body);
    }

    /**
     * Méthode interne : envoi d'un email via PHPMailer (SMTP).
     */
    private function send(string $toEmail, string $toName, string $subject, string $body): bool
    {
        $mail = new PHPMailer(true);

        try {
            // Configuration SMTP
            $mail->isSMTP();
            $mail->Host       = $_ENV['MAIL_HOST']     ?? 'smtp.mailtrap.io';
            $mail->Port       = (int)($_ENV['MAIL_PORT'] ?? 587);
            $mail->SMTPAuth   = true;
            $mail->Username   = $_ENV['MAIL_USERNAME']  ?? '';
            $mail->Password   = $_ENV['MAIL_PASSWORD']  ?? '';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

            // Expéditeur et destinataire
            $mail->setFrom($_ENV['MAIL_FROM_ADDRESS'], $_ENV['MAIL_FROM_NAME']);
            $mail->addAddress($toEmail, $toName);

            // Contenu
            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8';
            $mail->Subject = $subject;
            $mail->Body    = $body;

            $mail->send();
            return true;

        } catch (Exception $e) {
            error_log('Erreur envoi email : ' . $e->getMessage());
            return false;
        }
    }
}
