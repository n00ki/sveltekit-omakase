declare global {
  namespace App {
    interface Locals {
      user: import('$lib/server/auth').SessionValidationResult['user'];
      session: import('$lib/server/auth').SessionValidationResult['session'];
    }

    interface PageData {
      metadata: {
        title: string;
        description: string;
        image: string;
        url: string;
        breadcrumbs: {
          title: string;
          href: string;
        }[];
      };
    }
  }
}

export {};
