import type { EmailTemplate } from '../types';

interface AccountInviteEmailProps {
  url: string;
  invitedBy: string;
}

export function accountInviteEmail({ url, invitedBy }: AccountInviteEmailProps): EmailTemplate {
  const html = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>👥 You’re Invited to Collaborate on SvelteKit Omakase!</title>
      <style>
          body {
              font-family: Arial, sans-serif;
          }
      </style>
  </head>
  <body>
      <h2>👥 You’re Invited to Collaborate on <span style="color: #f59e0b">SvelteKit Omakase</span></h2><p>Hey! 👋</p><p>${invitedBy} has invited you to join their team account on SvelteKit Omakase! 🥁</p><p>To get started, click the link below and accept the invitation:</p><p><a target="_blank" rel="noopener noreferrer nofollow" href="${url}">Click here to join</a></p><hr><p>If you have any questions, feel free to <a target="_blank" rel="noopener noreferrer nofollow" href="https://mailto:noams+ks@hey.com">reach out</a>.</p><p>Welcome aboard! 🎉</p>
  </body>
  </html>
  `.trim();

  const text = `
  👥 YOU’RE INVITED TO COLLABORATE ON SVELTEKIT OMAKASE

  Hey! 👋

  ${invitedBy} has invited you to join their team account on SvelteKit Omakase! 🥁

  To get started, click the link below and accept the invitation:

  Click here to join [${url}]

  --------------------------------------------------------------------------------

  If you have any questions, feel free to reach out
  [https://mailto:noams+ks@hey.com].

  Welcome aboard! 🎉
  `.trim();

  return {
    subject: `👥 You’re Invited to Collaborate on SvelteKit Omakase!`,
    html,
    text
  };
}
