import type { EmailTemplate } from '../types';

interface ResetPasswordEmailProps {
  userFirstName: string;
  url: string;
}

export function resetPasswordEmail({ userFirstName, url }: ResetPasswordEmailProps): EmailTemplate {
  const html = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>🔒 Reset Your Password</title>
      <style>
          body {
              font-family: Arial, sans-serif;
          }
      </style>
  </head>
  <body>
      <h2>🔒 Reset Your Password</h2><p>Hey, ${userFirstName}!</p><p>It looks like you requested a password reset. No worries, we’ve got you covered!</p><p>Click the link below to reset your password:</p><p><a target="_blank" rel="noopener noreferrer nofollow" href="${url}">Reset Your Password</a></p><hr><p>If you didn’t request this, please ignore this email or <a target="_blank" rel="noopener noreferrer nofollow" href="https://mailto:noams+ks@hey.com">contact us</a>.</p><p>Stay secure 🛟</p>
  </body>
  </html>
  `.trim();

  const text = `
  🔒 RESET YOUR PASSWORD

  Hey, ${userFirstName}!

  It looks like you requested a password reset. No worries, we’ve got you covered!

  Click the link below to reset your password:

  Reset Your Password [${url}]

  --------------------------------------------------------------------------------

  If you didn’t request this, please ignore this email or contact us
  [https://mailto:noams+ks@hey.com].

  Stay secure 🛟
  `.trim();

  return {
    subject: `🔒 Reset Your Password`,
    html,
    text
  };
}
