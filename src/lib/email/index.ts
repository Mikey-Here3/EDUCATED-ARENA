import { APP_CONFIG } from '@/config';
import {
  sendEmail as sendViaService,
  sendVerificationEmail as sendVerifyViaService,
  sendPasswordResetEmail as sendResetViaService,
} from '@/lib/services/email.service';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  return sendViaService(params);
}

export async function sendVerificationEmail(email: string, token: string, username?: string): Promise<void> {
  const verificationUrl = `${APP_CONFIG.app.url}/verify-email?token=${token}`;
  return sendViaService({
    to: email,
    subject: 'Verify your Educated Gamer Arena account',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f0f0f;color:#fff;border-radius:12px">
        <h1 style="color:#DC2626;font-size:24px;margin-bottom:16px">Welcome to Educated Gamer Arena${username ? `, ${username}` : ''}!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="display:inline-block;margin:24px 0;padding:12px 32px;background:#DC2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">
          Verify Email
        </a>
        <p style="color:#888;font-size:13px">If you did not create an account, you can safely ignore this email.</p>
        <p style="color:#888;font-size:13px">This link expires in 24 hours.</p>
      </div>
    `,
    text: `Welcome to Educated Gamer Arena${username ? `, ${username}` : ''}!\nPlease verify your email by visiting: ${verificationUrl}`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${APP_CONFIG.app.url}/reset-password?token=${token}`;
  return sendViaService({
    to: email,
    subject: 'Password Reset Request — Educated Gamer Arena',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f0f0f;color:#fff;border-radius:12px">
        <h1 style="color:#DC2626;font-size:24px;margin-bottom:16px">Password Reset</h1>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;margin:24px 0;padding:12px 32px;background:#DC2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">
          Reset Password
        </a>
        <p style="color:#888;font-size:13px">If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
    text: `Password Reset\nVisit this URL to reset your password: ${resetUrl}`,
  });
}

export async function sendMatchNotificationEmail(email: string, matchDetails: { publicId: string; opponent: string; scheduledTime?: string }): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Match Update: ${matchDetails.publicId}`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f0f0f;color:#fff;border-radius:12px">
        <h1 style="color:#DC2626;font-size:24px;margin-bottom:16px">Match Notice — ${matchDetails.publicId}</h1>
        <p>Your match against <strong>${matchDetails.opponent}</strong> has an update.</p>
        ${matchDetails.scheduledTime ? `<p>Scheduled for: <strong>${matchDetails.scheduledTime}</strong></p>` : ''}
        <a href="${APP_CONFIG.app.url}/dashboard/matches" style="display:inline-block;margin:24px 0;padding:12px 32px;background:#DC2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">
          View Match
        </a>
      </div>
    `,
    text: `Match Update for ${matchDetails.publicId} vs ${matchDetails.opponent}. Visit: ${APP_CONFIG.app.url}/dashboard/matches`,
  });
}
