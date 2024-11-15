import type { EmailTemplate } from '../types';

interface PreviewEmailProps {
  from: string;
  to: string;
  subject: string;
}

export function previewEmail({ from, to, subject }: PreviewEmailProps): EmailTemplate {
  const html = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <style>
          body {
              font-family: Arial, sans-serif;
          }
      </style>
  </head>
  <body>
    <p><strong>subject:</strong> ${subject}</p>
    <p><strong>from:</strong> ${from}</p>
    <p><strong>to:</strong> ${to}</p>
  </body>
  </html>
  `.trim();

  const text = `
  from: ${from}
  to: ${to}
  `.trim();

  return {
    subject,
    html,
    text
  };
}
