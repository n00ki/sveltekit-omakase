// Env Variables
import { SENDGRID_API_KEY, EMAIL_SENDER } from '$env/static/private';

// Stores
import { dev } from '$app/environment';

// Utils
import sendgrid from '@sendgrid/mail';
import { fail } from '@sveltejs/kit';
import { render } from 'svelty-email';
import { previewHTML } from '$lib/utils/helpers/preview';

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
        console.log('Invite URL:', templateData?.url ?? '');
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
      previewHTML(html);
    } else {
      sendgrid.setApiKey(SENDGRID_API_KEY);
      await sendgrid.send(options);
      console.log('Email sent successfully');
    }
  }
};
