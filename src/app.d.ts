declare global {
  namespace App {
    interface Locals {
      user: import('#lib/server/auth.ts').User | null;
      session: import('#lib/server/auth.ts').Session | null;
    }

    interface Error {
      message: string;
      code?: string;
    }

    interface PageData {
      user: import('#lib/server/auth.ts').User | null;
      session: import('#lib/server/auth.ts').Session | null;
      metadata?: {
        title?: string;
        description?: string;
        image?: string;
        url?: string;
        breadcrumbs?: {
          title: string;
          href: string;
        }[];
      };
    }
  }
}

export {};
