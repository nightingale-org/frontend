declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
    user?: {
      name: string;
      email: string;
      image: string | null;
      id: string;
      bio: string | null;
    };
  }
}
