/**
 * Email Service Abstraction for Educated Gamer Arena
 *
 * Supports pluggable providers: "console" (dev), "smtp", "resend".
 * Provider can be changed via EMAIL_PROVIDER env var without rewriting auth.
 */
import { APP_CONFIG } from '@/config';
import { logger } from '@/lib/logger';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailProvider {
  send(payload: EmailPayload): Promise<void>;
}

// ── Console Provider (development only) ─────────────
class ConsoleEmailProvider implements EmailProvider {
  async send(payload: EmailPayload): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[EMAIL WARNING] ConsoleEmailProvider is active in production. Please configure SMTP or Resend.');
      console.log(`📧 [PRODUCTION EMAIL] To: ${payload.to} | Subject: ${payload.subject} (Body suppressed for security)`);
      return;
    }
    console.log('\n═══════════════════════════════════════════');
    console.log(`📧 EMAIL (dev console)`);
    console.log(`   To:      ${payload.to}`);
    console.log(`   Subject: ${payload.subject}`);
    console.log(`   Body:    ${payload.text || '(HTML only)'}`);
    console.log('═══════════════════════════════════════════\n');
  }
}

// ── SMTP Provider (production) ──────────────────────
class SmtpEmailProvider implements EmailProvider {
  async send(payload: EmailPayload): Promise<void> {
    // Dynamic import to avoid bundling nodemailer when not needed
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: APP_CONFIG.email.smtp.host,
        port: APP_CONFIG.email.smtp.port,
        secure: APP_CONFIG.email.smtp.port === 465,
        auth: {
          user: APP_CONFIG.email.smtp.user,
          pass: APP_CONFIG.email.smtp.pass,
        },
      });

      await transporter.sendMail({
        from: APP_CONFIG.email.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      });
    } catch (error) {
      logger.error('email.send_failed', { message: `SMTP send failed to ${payload.to}`, meta: { subject: payload.subject } });
      throw error;
    }
  }
}

// ── Resend Provider ─────────────────────────────────
class ResendEmailProvider implements EmailProvider {
  async send(payload: EmailPayload): Promise<void> {
    const apiKey = APP_CONFIG.email.apiKey || process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
    if (!apiKey) {
      console.warn('[EMAIL WARNING] Resend API key missing. Logging email payload to console:');
      console.log(`To: ${payload.to} | Subject: ${payload.subject} | Text: ${payload.text}`);
      return;
    }

    const defaultFrom = process.env.EMAIL_FROM || 'Educated Gamer Arena <onboarding@resend.dev>';

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: defaultFrom,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        // If from address failed (e.g. domain not verified), retry once with onboarding@resend.dev
        if (!defaultFrom.includes('onboarding@resend.dev')) {
          console.warn(`Resend failed with ${defaultFrom}, retrying with onboarding@resend.dev...`);
          const retryRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              from: 'Educated Gamer Arena <onboarding@resend.dev>',
              to: payload.to,
              subject: payload.subject,
              html: payload.html,
              text: payload.text,
            }),
          });
          if (retryRes.ok) {
            console.log(`[EMAIL SENT] Successfully sent email to ${payload.to} via Resend!`);
            return;
          }
        }

        console.error(`Resend API error (${res.status}):`, body);
        logger.error('email.send_failed', { message: `Resend API error: ${res.status}`, meta: { body } });
        // Fallback log for registration OTP so user is never blocked while testing
        console.warn(`[OTP CODE DIRECT LOG] To: ${payload.to} | Message: ${payload.text}`);
      } else {
        console.log(`[EMAIL SENT] Successfully sent email to ${payload.to} via Resend!`);
      }
    } catch (err: any) {
      console.error('Resend fetch exception:', err);
      console.warn(`[OTP CODE DIRECT LOG] To: ${payload.to} | Message: ${payload.text}`);
    }
  }
}

// ── Factory ─────────────────────────────────────────
function getProvider(): EmailProvider {
  switch (APP_CONFIG.email.provider) {
    case 'smtp':
      return new SmtpEmailProvider();
    case 'resend':
      return new ResendEmailProvider();
    case 'console':
    default:
      return new ConsoleEmailProvider();
  }
}

const provider = getProvider();

// ── Public API ──────────────────────────────────────
export async function sendEmail(payload: EmailPayload): Promise<void> {
  await provider.send(payload);
}

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Your Verification Code — Educated Gamer Arena',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f0f0f;color:#fff;border-radius:12px">
        <h1 style="color:#DC2626;font-size:24px;margin-bottom:16px">Welcome to Educated Gamer Arena</h1>
        <p>Please enter the following 6-digit code to verify your email address:</p>
        <div style="font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 4px; padding: 20px; background-color: #222; text-align: center; border: 1px solid #333; border-radius: 8px; margin: 20px 0;">
          ${token}
        </div>
        <p style="color:#888;font-size:13px">If you did not create an account, you can safely ignore this email.</p>
        <p style="color:#888;font-size:13px">This code expires in ${APP_CONFIG.auth.emailVerifyExpiryHours} hours.</p>
      </div>
    `,
    text: `Your verification code is: ${token}`,
  });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const resetUrl = `${APP_CONFIG.app.url}/reset-password?token=${token}`;
  await sendEmail({
    to,
    subject: 'Password Reset — Educated Gamer Arena',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f0f0f;color:#fff;border-radius:12px">
        <h1 style="color:#DC2626;font-size:24px;margin-bottom:16px">Password Reset</h1>
        <p>You requested a password reset. Click the button below:</p>
        <a href="${resetUrl}" style="display:inline-block;margin:24px 0;padding:12px 32px;background:#DC2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">
          Reset Password
        </a>
        <p style="color:#888;font-size:13px">If you did not request this, you can safely ignore this email.</p>
        <p style="color:#888;font-size:13px">This link expires in ${APP_CONFIG.auth.passwordResetExpiryMinutes} minutes.</p>
      </div>
    `,
    text: `Reset your password: ${resetUrl}`,
  });
}
