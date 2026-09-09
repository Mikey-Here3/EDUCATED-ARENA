import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'mock_key');

export async function sendVerificationEmail(email: string, otp: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('\n=============================================');
    console.warn(`[MOCK EMAIL] To: ${email}`);
    console.warn(`[MOCK EMAIL] Subject: Educated Gamer Arena - Verification Code`);
    console.warn(`[MOCK EMAIL] OTP CODE: ${otp}`);
    console.warn('=============================================\n');
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'Educated Gamer Arena <noreply@educatedgamer.com>',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111; color: #fff;">
          <h2 style="color: #a855f7; text-transform: uppercase;">Welcome to the Arena!</h2>
          <p>Please use the following 6-digit verification code to activate your account:</p>
          <div style="font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 4px; padding: 20px; background-color: #222; text-align: center; border: 1px solid #333; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 15 minutes.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error: any) {
    console.error('Resend error:', error);
    return { success: false, error: error.message };
  }
}
