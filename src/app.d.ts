declare namespace App {
  interface Locals {
    auth: import('lucia').AuthRequest;
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

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('$lib/server/lucia').Auth;
  type DatabaseUserAttributes = {
    email: string;
    avatar?: string;
  };
  // type DatabaseSessionAttributes = {}
}
