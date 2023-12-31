declare global {
  declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
      accessToken: string;
      user?: {
        name: string;
        email: string;
        image: string;
        id: string;
        bio: string | null;
      };
    }

    interface Account {
      expires_at: number;
    }
  }
}
