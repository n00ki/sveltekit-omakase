// Env Variables
import { RESEND_API_KEY, EMAIL_SENDER } from '$env/static/private';

// Types
import type { Component } from 'svelte';

// Stores
import { dev } from '$app/environment';

// Utils
import { Resend } from 'resend';
import { previewEmail, renderEmail } from 'sailkit';

// Templates
import WelcomeTemplate from './templates/welcome.svelte';
import ResetPasswordTemplate from './templates/reset-password.svelte';

export enum Emails {
  Welcome = 'Welcome',
  ResetPassword = 'ResetPassword'
}

type Data = {
  url?: string;
  userFirstName?: string;
  releaseTitle?: string;
};

type Config = {
  component: Component;
  requiredProps: (keyof Data)[];
  subject?: string; // default subject for this template
};

const TEMPLATES: Record<Emails, Config> = {
  [Emails.Welcome]: {
    component: WelcomeTemplate as Component,
    requiredProps: ['userFirstName'],
    subject: '🥋 Welcome to SvelteKit Omakase!'
  },
  [Emails.ResetPassword]: {
    component: ResetPasswordTemplate as Component,
    requiredProps: ['userFirstName'],
    subject: '🔒 Reset Your Password'
  }
};

// Validates that all required props for a template are present in the provided data
const validateTemplateData = (templateName: Emails, data?: Data): void => {
  const template = TEMPLATES[templateName];
  const missingProps = template.requiredProps.filter((prop) => !data || data[prop] === undefined);

  if (missingProps.length > 0) {
    throw new Error(`Missing required properties for ${templateName} template: ${missingProps.join(', ')}`);
  }
};

// Sends an email using the specified template
export const sendEmail = async (
  to: string,
  templateName: Emails,
  templateData: Data,
  options?: { subject?: string }
): Promise<void> => {
  if (!to) {
    throw new Error('Recipient email address is required');
  }

  if (!templateName || !TEMPLATES[templateName]) {
    throw new Error(`Unknown or invalid template: ${templateName}`);
  }

  // Validate template data
  validateTemplateData(templateName, templateData);

  const config = TEMPLATES[templateName];
  const emailSubject = options?.subject ?? config.subject ?? `New message from ${EMAIL_SENDER}`;

  try {
    const { html } = await renderEmail(config.component, templateData);
    const mailOptions = { from: EMAIL_SENDER, to, subject: emailSubject, html };

    if (dev) {
      await previewEmail(config.component, templateData, 'console');
      console.log(`Email preview generated for ${to}`);
      return;
    }

    const resend = new Resend(RESEND_API_KEY);
    const { data, error } = await resend.emails.send(mailOptions);

    if (error) {
      throw new Error(`Email service error: ${error.message}`);
    }

    console.log(`Email sent successfully to ${to} with ID: ${data?.id}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred while sending email');
  }
};
