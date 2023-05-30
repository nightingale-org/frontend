import {ApplicationError, ConflictError, NotFoundError, PreconditionFailedError} from './errors';
import {env} from "@/env";
import {getServerSession} from "next-auth";
import {authOptions} from "@/libs/auth/options";

const JSON_ContentType = 'application/json; charset=utf-8';

export async function getAccessToken(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    return session.accessToken;
  }

  const response = await fetch(`${env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.AUTH0_API_CLIENT_ID,
      client_secret: env.AUTH0_API_CLIENT_SECRET,
      audience: env.AUTH0_AUDIENCE
    })
  })

  const jsonResponse = await response.json();
  return jsonResponse["access_token"] as string;
}

export const CustomHeaders: { [key: string]: string } = {};

async function tryParseBodyAsJSON(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');

  if (contentType !== null && contentType.indexOf('json') > -1) {
    return await response.json();
  }

  return await response.text();
}

async function getAuthorizationHeader(): Promise<{ [key: string]: string }> {
  return {
    Authorization: `Bearer ${await getAccessToken()}`
  };
}

/**
 * Wrapper around fetch API, with common logic to handle application errors
 * and response bodies.
 *
 * If the server returns 401 Unauthorized, this method tries once to obtain new
 * tokens silently. If that succeeds, the application flow continues
 * transparently, by repeating the original web request with a new token.
 */
async function appFetch<T>(
  input: RequestInfo,
  init?: RequestInit,
  addAuth = true,
  retrying = false
): Promise<T> {
  // extend init properties with an access token
  if (addAuth) {
    if (init === undefined) {
      init = {
        headers: Object.assign({}, await getAuthorizationHeader(), CustomHeaders)
      };
    } else {
      init.headers = Object.assign({}, init.headers, await getAuthorizationHeader(), CustomHeaders);
    }
  }

  const response = await fetch(input, init);

  const data = await tryParseBodyAsJSON(response);

  if (response.status === 404) {
    throw new NotFoundError();
  }

  if (response.status === 409) {
    throw new ConflictError();
  }

  if (response.status === 412) {
    throw new PreconditionFailedError();
  }

  if (response.status >= 400) {
    throw new ApplicationError('Response status does not indicate success', response.status, data);
  }

  return data as T;
}

export async function get<T>(
  url: string,
  headers?: HeadersInit,
  addAuth: boolean = true
): Promise<T> {
  return await appFetch(
    url,
    {
      method: 'GET',
      headers
    },
    addAuth
  );
}

export async function getOptional<T>(
  url: string,
  headers?: HeadersInit,
  addAuth: boolean = true
): Promise<T | null> {
  try {
    return await appFetch(
      url,
      {
        method: 'GET',
        headers
      },
      addAuth
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }

    throw error;
  }
}

export async function post<T>(
  url: string,
  data: any = null,
  headers?: { [key: string]: string }
): Promise<T> {
  if (!data) {
    return await appFetch(url, {
      method: 'POST'
    });
  }

  return await appFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: headers || {
      'Content-Type': JSON_ContentType
    }
  });
}

export async function patch<T>(
  url: string,
  data: any,
  headers?: { [key: string]: string }
): Promise<T> {
  return await appFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: headers || {
      'Content-Type': JSON_ContentType
    }
  });
}

export async function put<T>(
  url: string,
  data: any,
  headers?: { [key: string]: string }
): Promise<T> {
  return await appFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: headers || {
      'Content-Type': JSON_ContentType
    }
  });
}

export async function del<T>(
  url: string,
  data: any = null,
  headers?: { [key: string]: string }
): Promise<T> {
  if (!data) {
    return await appFetch(url, {
      method: 'DELETE'
    });
  }

  return await appFetch(url, {
    method: 'DELETE',
    body: JSON.stringify(data),
    headers: headers || {
      'Content-Type': JSON_ContentType
    }
  });
}
