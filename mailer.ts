import nodemailer from 'nodemailer';

/**
 * Lazily-created SMTP transport. Returns null if SMTP env vars are not set,
 * so callers can fall back to a dev-only behavior (e.g. show the OTP in a
 * toast) instead of failing the request.
 */
let cachedTransport: nodemailer.Transporter | null | undefined;

export function getTransport(): nodemailer.Transporter | null {
  if (cachedTransport !== undefined) return cachedTransport;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    cachedTransport = null;
    return null;
  }

  cachedTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return cachedTransport;
}

export function getFromAddress(): string {
  return process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com';
}

/** Returns true if SMTP is fully configured. */
export function isSmtpConfigured(): boolean {
  return getTransport() !== null;
}

/** Send a 6-digit OTP code to the recipient. Returns true on success. */
export async function sendOtpEmail(opts: {
  to: string;
  otp: string;
}): Promise<{ ok: boolean; error?: string }> {
  const transport = getTransport();
  if (!transport) {
    return { ok: false, error: 'SMTP not configured' };
  }

  try {
    const info = await transport.sendMail({
      from: getFromAddress(),
      to: opts.to,
      subject: 'Your Instagram demo verification code',
      text: [
        `Your verification code is: ${opts.otp}`,
        '',
        'It expires in 10 minutes. If you did not request this code, you can ignore this email.',
      ].join('\n'),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="margin: 0 0 16px 0; color: #1a1a1a;">Instagram demo</h2>
          <p style="margin: 0 0 12px 0; color: #555;">Use this code to reset your password:</p>
          <div style="font-size: 32px; font-weight: 600; letter-spacing: 6px; color: #0095f6; background: #f4f8fc; border-radius: 8px; padding: 16px; text-align: center; margin: 16px 0;">
            ${opts.otp}
          </div>
          <p style="margin: 0; color: #777; font-size: 13px;">
            This code expires in 10 minutes. If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    return { ok: true };
  } catch (err) {
    console.error('[mailer] sendOtpEmail failed:', err);
    const msg = err instanceof Error ? err.message : 'Unknown SMTP error';
    return { ok: false, error: msg };
  }
}
