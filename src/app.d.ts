declare global {
  type User = import('$lib/server/auth').User;
  type Session = import('$lib/server/auth').Session;

  namespace App {
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
