// middleware.ts
/**
 * See [Edge Runtime](https://nextjs.org/docs/api-reference/edge-runtime)
 * for more information about Next.js middleware.
 */
import type { NextMiddleware, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";
import { getToken } from "next-auth/jwt";
import type {
  NextAuthMiddlewareOptions,
  NextMiddlewareWithAuth,
  WithAuthArgs,
} from "next-auth/middleware";

/**
 * This hash function relies on Edge Runtime.
 * Importing node.js crypto module will throw an error.
 */
async function hash(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface AuthMiddlewareOptions extends NextAuthMiddlewareOptions {
  trustHost?: boolean;
}

async function handleMiddleware(
  req: NextRequest,
  options: AuthMiddlewareOptions | undefined = {},
  onSuccess?: (token: JWT | null) => ReturnType<NextMiddleware>
) {
  const { origin, basePath } = req.nextUrl;
  const errorPage = options?.pages?.error ?? "/api/auth/error";

  options.trustHost ??= !!(
    process.env.NEXTAUTH_URL ??
    process.env.VERCEL ??
    process.env.AUTH_TRUST_HOST
  );

  const host =
    process.env.NEXTAUTH_URL ??
    req.headers?.get("x-forwarded-host") ??
    "http://localhost:3000";

  options.secret ??= process.env.NEXTAUTH_SECRET;
  if (!options.secret) {
    console.error(
      `[next-auth][error][NO_SECRET]`,
      `\nhttps://next-auth.js.org/errors#no_secret`
    );

    const errorUrl = new URL(`${basePath}${errorPage}`, origin);
    errorUrl.searchParams.append("error", "Configuration");

    return NextResponse.redirect(errorUrl);
  }

  const token = await getToken({
    req,
    decode: options.jwt?.decode,
    cookieName: options?.cookies?.sessionToken?.name,
    secret: options.secret,
  });

  const isAuthorized =
    (await options?.callbacks?.authorized?.({ req, token })) ?? !!token;

  // the user is authorized, let the middleware handle the rest
  if (isAuthorized) return onSuccess?.(token);

  const cookieCsrfToken = req.cookies.get("next-auth.csrf-token")?.value;
  const csrfToken =
    cookieCsrfToken?.split("|")?.[0] ?? "";
  const csrfTokenHash =
    cookieCsrfToken?.split("|")?.[1] ??
    (await hash(`${csrfToken}${options.secret}`));
  const cookie = `${csrfToken}|${csrfTokenHash}`;
  const res = await fetch(`${host}/api/auth/signin/auth0`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
      cookie: `next-auth.csrf-token=${cookie}`,
    },
    credentials: "include",
    redirect: "follow",
    body: new URLSearchParams({
      csrfToken,
      callbackUrl: req.url,
      json: "true",
    }),
  });
  const data = (await res.json()) as { url: string };

  return NextResponse.redirect(data.url, {
    headers: {
      "Set-Cookie": res.headers.get("set-cookie") ?? "",
    },
  });
}

export function withAuth(...args: WithAuthArgs) {
  if (!args.length || args[0] instanceof Request) {
    return handleMiddleware(...(args as Parameters<typeof handleMiddleware>));
  }

  if (typeof args[0] === "function") {
    const middleware = args[0];
    const options = args[1] as NextAuthMiddlewareOptions | undefined;
    return async (...args: Parameters<NextMiddlewareWithAuth>) =>
      await handleMiddleware(args[0], options, async (token: JWT | null) => {
        args[0].nextauth = { token };
        return await middleware(...args);
      });
  }

  const options = args[0];
  return async (...args: Parameters<NextMiddleware>) =>
    await handleMiddleware(args[0], options);
}

export default withAuth({});

export const config = {
  matcher: [
    // This matcher is necessary to capture the origin route
    "/",
    // Do not match public pages or auth routes
    "/((?!api/auth|_next|public|favicon.ico|logo.svg).*)",
  ],
};
