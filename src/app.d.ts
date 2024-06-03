declare namespace App {
  interface Locals {
    user: import('lucia').User | null;
    session: import('lucia').Session | null;
    theme: string;
  }

  interface PageData {
    metadata: {
      title: string;
      description: string;
      image: string;
      url: string;
    };
  }
}
