import Auth0Provider from 'next-auth/providers/auth0';
import RestAPIAdapter from '@/lib/auth/adapter';
import { getCurrentUser } from '@/lib/api/query-functions';
import type { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  adapter: RestAPIAdapter(),
  providers: [
    Auth0Provider({
      issuer: process.env.AUTH0_DOMAIN,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      clientId: process.env.AUTH0_CLIENT_ID,
      // @ts-expect-error
      audience: process.env.AUTH0_AUDIENCE,
      idToken: true,
      authorization: {
        params: {
          audience: encodeURI(process.env.AUTH0_AUDIENCE)
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token, ...rest }) {
      session.accessToken = token.accessToken as string;

      if (session.user) {
        const currentUser = await getCurrentUser(session.accessToken);
        session.user.name = currentUser.username;
        session.user.image = currentUser.image;
        session.user.id = currentUser.id;
        session.user.bio = currentUser.bio;
      }

      return session;
    },
    async jwt({ token, account, trigger, session, ...rest }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET
};
