// Env Variables
import { SENDGRID_API_KEY, EMAIL_SENDER } from '$env/static/private';

// Stores
import { dev } from '$app/environment';

// Utils
import sendgrid from '@sendgrid/mail';
import { fail } from '@sveltejs/kit';
import { previewHTML } from '$lib/utils/helpers/preview';

// Templates
import { welcomeEmail } from './templates/welcome';
import { resetPasswordEmail } from './templates/resetPassword';
import { accountInviteEmail } from './templates/accountInvite';
import { previewEmail } from './templates/preview';

export const sendEmail = async (
  to: string,
  templateName: string,
  templateData?: { url?: string; userFirstName?: string; invitedBy?: string; releaseTitle?: string }
) => {
  if (to && templateName) {
    let html, subject;

    switch (templateName) {
      case 'Welcome':
        const welcome = welcomeEmail({ userFirstName: templateData?.userFirstName ?? '' });
        subject = welcome.subject;
        html = welcome.html;
        break;
      case 'ResetPassword':
        const reset = resetPasswordEmail({
          userFirstName: templateData?.userFirstName ?? '',
          url: templateData?.url ?? ''
        });
        subject = reset.subject;
        html = reset.html;
        break;
      case 'AccountInvite':
        const invite = accountInviteEmail({
          url: templateData?.url ?? '',
          invitedBy: templateData?.invitedBy ?? ''
        });
        subject = invite.subject;
        html = invite.html;
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
      const previewTemplate = previewEmail({
        from: options.from,
        to: options.to,
        subject: options.subject
      }).html;

      html = previewTemplate + html;
      previewHTML(html);
    } else {
      sendgrid.setApiKey(SENDGRID_API_KEY);
      await sendgrid.send(options);
      console.log('Email sent successfully');
    }
  }
};
