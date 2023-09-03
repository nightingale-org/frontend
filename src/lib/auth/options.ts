import Auth0Provider from 'next-auth/providers/auth0';
import RestAPIAdapter from '@/lib/auth/adapter';
import { getCurrentUser } from '@/lib/api/query-functions';
import type { AuthOptions, TokenSet } from 'next-auth';

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
          scope: 'openid email profile offline_access',
          audience: encodeURI(process.env.AUTH0_AUDIENCE)
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.access_token as string;

      if (session.user) {
        const currentUser = await getCurrentUser({ accessToken: session.accessToken });
        session.user.name = currentUser.username;
        session.user.image = currentUser.image;
        session.user.id = currentUser.id;
        session.user.bio = currentUser.bio;
        session.user.email = currentUser.email;
      }

      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        return {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token
        };
      } else if (Date.now() < (token.expires_at as number) * 1000) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        // If the access token has expired, try to refresh it
        try {
          // https://auth0.com/docs/secure/tokens/refresh-tokens/use-refresh-tokens
          const response = await fetch(`${process.env.AUTH0_DOMAIN}/oauth/token`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.AUTH0_CLIENT_ID,
              client_secret: process.env.AUTH0_CLIENT_SECRET,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token as string
            }),
            method: 'POST'
          });

          const tokens: TokenSet = await response.json();

          if (!response.ok) throw tokens;

          return {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: tokens.refresh_token ?? token.refresh_token
          };
        } catch (error) {
          console.error('Error refreshing access token', error);
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: 'RefreshAccessTokenError' as const };
        }
      }
    }
  },
  debug: false, // process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET
};
