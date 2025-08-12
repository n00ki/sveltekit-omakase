declare global {
  namespace App {
    interface Locals {
      user: import('$lib/server/auth').User;
      session: import('$lib/server/auth').Session;
    }

    interface PageData {
      user: User | null;
      session: Session | null;
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
