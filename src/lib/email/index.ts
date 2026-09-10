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
    subject: `[Educated Gamer Arena] Your Verification Code: ${token}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:28px;background:#0c0914;color:#fff;border-radius:16px;border:1px solid #2a223e">
        <div style="text-align:center;margin-bottom:20px">
          <h1 style="color:#00f0ff;font-size:24px;margin:0;letter-spacing:1px;text-transform:uppercase">Educated Gamer Arena</h1>
          <p style="color:#a855f7;font-size:13px;font-weight:bold;margin-top:4px">BATTLE GROUND VERIFICATION</p>
        </div>
        <p style="font-size:15px;color:#e2e8f0;text-align:center">Welcome ${username ? `<strong>${username}</strong>` : 'Gamer'}! Enter this 6-digit activation code to verify your account:</p>
        
        <div style="margin:24px auto;padding:18px;background:#140c24;border:2px dashed #00f0ff;border-radius:14px;text-align:center;max-width:280px">
          <span style="font-family:monospace;font-size:38px;font-weight:900;letter-spacing:10px;color:#00ff88;display:block">
            ${token}
          </span>
        </div>

        <p style="font-size:13px;color:#94a3b8;text-align:center">Or click the button below to verify automatically in your browser:</p>
        <div style="text-align:center;margin:20px 0">
          <a href="${verificationUrl}" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#00f0ff,#7928ca);color:#fff;text-decoration:none;border-radius:10px;font-weight:bold;font-size:14px">
            VERIFY MY ACCOUNT
          </a>
        </div>
        <div style="border-top:1px solid #221a36;margin-top:24px;padding-top:16px;text-align:center">
          <p style="color:#64748b;font-size:12px;margin:0">If you did not create this account, please disregard this email. This code expires in 24 hours.</p>
        </div>
      </div>
    `,
    text: `Your Educated Gamer Arena 6-digit verification code is: ${token}\nOr verify your account directly at: ${verificationUrl}`,
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
