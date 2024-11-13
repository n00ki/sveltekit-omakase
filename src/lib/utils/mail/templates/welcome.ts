import type { EmailTemplate } from '../types';

export interface WelcomeEmailProps {
  userFirstName: string;
}

export function welcomeEmail({ userFirstName }: WelcomeEmailProps): EmailTemplate {
  const html = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>🥋 Welcome to SvelteKit Omakase!</title>
      <style>
          body {
              font-family: Arial, sans-serif;
          }
      </style>
  </head>
  <body>
      <h2>Welcome to <span style="color: #f59e0b">SvelteKit Omakase</span></h2><p>Hey, ${userFirstName}!</p><p>We're thrilled to have you onboard. ⭐</p><hr><p>Need help? we are just an <a target="_blank" rel="noopener noreferrer nofollow" href="https://mailto:noams+ks@hey.com">email</a> away.</p><p></p>
  </body>
  </html>
  `.trim();

  const text = `
  WELCOME TO SVELTEKIT OMAKASE

  Hey, ${userFirstName}!

  We're thrilled to have you onboard. ⭐

  --------------------------------------------------------------------------------

  Need help? we are just an email [https://mailto:noams+ks@hey.com] away.
  `.trim();

  return {
    subject: `🥋 Welcome to SvelteKit Omakase!`,
    html,
    text
  };
}
