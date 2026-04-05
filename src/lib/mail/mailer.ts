import { EMAIL_SENDER, RESEND_API_KEY } from '$env/static/private';

import type { Component } from 'svelte';

import { dev } from '$app/environment';

import { Renderer, toPlainText } from '@better-svelte-email/server';
import { Resend } from 'resend';

import ResetPasswordTemplate from './templates/reset-password.svelte';
import WelcomeTemplate from './templates/welcome.svelte';

export const EMAILS = {
  resetPassword: 'resetPassword',
  welcome: 'welcome'
} as const;

export type EmailName = (typeof EMAILS)[keyof typeof EMAILS];

type EmailData = {
  welcome: {
    userFirstName: string;
  };
  resetPassword: {
    userFirstName: string;
    url: string;
  };
};

type EmailTemplate<T extends EmailName> = {
  component: Component;
  subject: string;
  validate: (data: EmailData[T]) => void;
};

type EmailTemplates = {
  [K in EmailName]: EmailTemplate<K>;
};

const renderer = new Renderer();

const emailTemplates: EmailTemplates = {
  [EMAILS.welcome]: {
    component: WelcomeTemplate as Component,
    subject: '🥋 Welcome to SvelteKit Omakase!',
    validate: (data: EmailData['welcome']) => {
      if (!data.userFirstName.trim()) {
        throw new Error('Missing required property for Welcome template: userFirstName');
      }
    }
  },
  [EMAILS.resetPassword]: {
    component: ResetPasswordTemplate as Component,
    subject: '🔒 Reset Your Password',
    validate: (data: EmailData['resetPassword']) => {
      if (!data.userFirstName.trim() || !data.url.trim()) {
        throw new Error('Missing required properties for ResetPassword template: userFirstName, url');
      }
    }
  }
};

type SendEmailOptions = {
  subject?: string;
};

export const sendEmail = async <T extends EmailName>(
  to: string,
  name: T,
  data: EmailData[T],
  options?: SendEmailOptions
): Promise<void> => {
  if (!to.trim()) {
    throw new Error('Recipient email address is required');
  }

  const template = emailTemplates[name];

  if (!template) {
    throw new Error(`Unknown or invalid template: ${name}`);
  }

  const subject = options?.subject ?? template.subject;

  try {
    template.validate(data);

    const html = await renderer.render(template.component, {
      props: data
    });
    const text = toPlainText(html);

    if (dev) {
      console.log(`Email preview for ${to} (${name})\nSubject: ${subject}\n\n${text}`);
      return;
    }

    const resend = new Resend(RESEND_API_KEY);
    const { data: result, error } = await resend.emails.send({
      from: EMAIL_SENDER,
      html,
      subject,
      text,
      to
    });

    if (error) {
      throw new Error(`Email service error: ${error.message}`);
    }

    console.log(`Email sent successfully to ${to} with ID: ${result?.id}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred while sending email');
  }
};
