namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_SECRET: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_AUDIENCE: string;
    AUTH0_API_CLIENT_ID: string;
    AUTH0_API_CLIENT_SECRET: string;
    NEXT_PUBLIC_BACKEND_API_URL: string;
  }
}
