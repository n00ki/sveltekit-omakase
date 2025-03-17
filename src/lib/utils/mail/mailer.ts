// Env Variables
import { RESEND_API_KEY, EMAIL_SENDER } from '$env/static/private';

// Stores
import { dev } from '$app/environment';

// Utils
import { Resend } from 'resend';
import { renderEmail } from 'sailkit';
import { previewHTML } from '$lib/utils/helpers/preview';
import { fail } from '@sveltejs/kit';

// Templates
import Welcome from './templates/Welcome.svelte';
import ResetPassword from './templates/ResetPassword.svelte';
import AccountInvite from './templates/AccountInvite.svelte';
import { previewEmail } from './templates/preview';

export const sendEmail = async (
  to: string,
  templateName: string,
  templateData?: { url?: string; userFirstName?: string; invitedBy?: string; releaseTitle?: string }
) => {
  if (to && templateName) {
    let html, subject;

    switch (templateName) {
      case 'Welcome': {
        const { html: welcomeHtml } = await renderEmail(Welcome, {
          userFirstName: templateData?.userFirstName ?? ''
        });
        subject = `🥋 Welcome to SvelteKit Omakase!`;
        html = welcomeHtml;
        break;
      }
      case 'ResetPassword': {
        const { html: resetHtml } = await renderEmail(ResetPassword, {
          userFirstName: templateData?.userFirstName ?? '',
          url: templateData?.url ?? ''
        });
        subject = `🔒 Reset Your Password`;
        html = resetHtml;
        break;
      }
      case 'AccountInvite': {
        const { html: inviteHtml } = await renderEmail(AccountInvite, {
          invitedBy: templateData?.invitedBy ?? '',
          url: templateData?.url ?? ''
        });
        subject = "👥 You're Invited to Collaborate on SvelteKit Omakase!";
        html = inviteHtml;
        console.log('Invite URL:', templateData?.url ?? '');
        break;
      }
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
      return previewHTML(html);
    }

    try {
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
};
