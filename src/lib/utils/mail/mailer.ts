// Env Variables
import { SENDGRID_API_KEY, EMAIL_SENDER } from '$env/static/private';

// Stores
import { dev } from '$app/environment';

// Utils
import sendgrid from '@sendgrid/mail';
import { fail } from '@sveltejs/kit';
import { render } from 'svelty-email';
import { exec } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';

// Templates
import PreviewTemplate from '$lib/utils/mail/templates/Preview.svelte';
import WelcomeTemplate from '$lib/utils/mail/templates/Welcome.svelte';
import ResetPasswordTemplate from '$lib/utils/mail/templates/ResetPassword.svelte';
import AccountInviteTemplate from '$lib/utils/mail/templates/AccountInvite.svelte';

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  templateData?: { url?: string; userFirstName?: string; invitedBy?: string; releaseTitle?: string }
) => {
  if (to && subject && templateName) {
    let html;

    switch (templateName) {
      case 'Welcome':
        html = render({
          template: WelcomeTemplate,
          props: {
            userFirstName: templateData?.userFirstName ?? ''
          }
        });
        break;
      case 'ResetPassword':
        html = render({
          template: ResetPasswordTemplate,
          props: {
            userFirstName: templateData?.userFirstName ?? '',
            url: templateData?.url ?? ''
          }
        });
        break;
      case 'AccountInvite':
        html = render({
          template: AccountInviteTemplate,
          props: {
            url: templateData?.url ?? '',
            invitedBy: templateData?.invitedBy ?? ''
          }
        });
        break;
      default:
        return fail(402);
    }

    const options = {
      from: EMAIL_SENDER,
      to,
      subject,
      html
    };

    if (dev) {
      const previewTemplate = render({
        template: PreviewTemplate,
        props: {
          from: options.from,
          to: options.to,
          subject: options.subject
        }
      });
      html = previewTemplate + html;
      openMailPreview(html);
    } else {
      sendgrid.setApiKey(SENDGRID_API_KEY);
      await sendgrid.send(options);
      console.log('Email sent successfully');
    }
  }
};

export function openMailPreview(htmlContent: string) {
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, 'temp.html');

  fs.writeFileSync(tempFilePath, htmlContent, 'utf-8');

  let command: string;

  switch (os.platform()) {
    case 'win32':
      command = `start ${tempFilePath}`;
      break;
    case 'darwin':
      command = `open ${tempFilePath}`;
      break;
    case 'linux':
      command = `xdg-open ${tempFilePath}`;
      break;
    default:
      console.error('Unsupported platfrom');
      return;
  }

  exec(command, (err) => {
    if (err) {
      console.log(`Error: ${err.message}`);
      return;
    } else {
      console.log('Email preview opened successfully');
    }
  });
}
