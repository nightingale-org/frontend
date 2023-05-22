import {AuthOptions} from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import RestAPIAdapter from "@/libs/auth/adapter";
import {env} from "@/env";


export const authOptions: AuthOptions = {
  adapter: RestAPIAdapter(),
  providers: [
    Auth0Provider({
      issuer: env.AUTH0_DOMAIN,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      clientId: env.AUTH0_CLIENT_ID,
      // @ts-expect-error
      audience: env.AUTH0_AUDIENCE,
      idToken: true,
      authorization: {
        params: {
          audience: encodeURI(env.AUTH0_AUDIENCE)
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    session: async ({session, token}) => {
      if (token) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({token, account}) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    }
  },
  debug: false,
  secret: env.NEXTAUTH_SECRET,
};
