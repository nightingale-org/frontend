import type { CtxOrReq } from 'next-auth/client/_utils';
import { ApplicationError, ConflictError, NotFoundError, PreconditionFailedError } from './errors';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const JSON_ContentType = 'application/json; charset=utf-8';

export type AuthorizationData =
  | {
      ctx: CtxOrReq;
      accessToken?: never;
    }
  | {
      ctx?: never;
      accessToken: string;
    }
  | {
      ctx?: never;
      accessToken?: never;
    };

type InferredZodeTypeOrCustom<T> = T extends z.ZodTypeAny ? z.infer<T> : T;

export type FetchInputBase<T> = {
  validationModel?: T extends z.ZodTypeAny ? T : z.ZodTypeAny;
} & AuthorizationData;

export type AppFetchInput<T> = {
  input: RequestInfo;
  init?: RequestInit;
} & FetchInputBase<T>;

export type FetchInputMethod<T> = {
  url: string;
  headers?: HeadersInit;
} & FetchInputBase<T>;

export const CustomHeaders: { [key: string]: string } = {};

export async function get<T>({
  url,
  ctx,
  headers,
  validationModel,
  accessToken
}: FetchInputMethod<T>) {
  return await appFetch<T>({
    input: url,
    validationModel,
    init: {
      method: 'GET',
      headers
    },
    ctx,
    accessToken
  } as AppFetchInput<T>);
}

export async function getOptional<T>({
  url,
  ctx,
  headers,
  validationModel,
  accessToken
}: FetchInputMethod<T>) {
  try {
    return await appFetch<T>({
      input: url,
      validationModel,
      init: {
        method: 'GET',
        headers
      },
      ctx,
      accessToken
    } as AppFetchInput<T>);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }

    throw error;
  }
}

export async function post<T>({
  url,
  ctx,
  validationModel,
  headers,
  accessToken,
  data = null
}: FetchInputMethod<T> & { data?: any }) {
  if (!data) {
    return await appFetch<T>({
      input: url,
      validationModel,
      init: {
        method: 'POST'
      },
      ctx,
      accessToken
    } as AppFetchInput<T>);
  }

  if (!(data instanceof FormData)) {
    return await appFetch<T>({
      input: url,
      validationModel,
      init: {
        method: 'POST',
        body: JSON.stringify(data),
        headers: headers || {
          'Content-Type': JSON_ContentType
        }
      },
      ctx,
      accessToken
    } as AppFetchInput<T>);
  }

  return await appFetch<T>({
    input: url,
    validationModel,
    init: {
      method: 'POST',
      body: data,
      headers: headers
    },
    ctx,
    accessToken
  } as AppFetchInput<T>);
}

export async function patch<T>({
  url,
  ctx,
  validationModel,
  headers,
  accessToken,
  data = null
}: FetchInputMethod<T> & { data?: any }) {
  return await appFetch<T>({
    input: url,
    validationModel,
    init: {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: headers || {
        'Content-Type': JSON_ContentType
      }
    },
    ctx,
    accessToken
  } as AppFetchInput<T>);
}

export async function put<T>({
  url,
  ctx,
  validationModel,
  headers,
  accessToken,
  data
}: FetchInputMethod<T> & { data: any }) {
  return await appFetch<T>({
    input: url,
    validationModel,
    init: {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: headers || {
        'Content-Type': JSON_ContentType
      }
    },
    ctx,
    accessToken
  } as AppFetchInput<T>);
}

export async function del<T>({
  url,
  ctx,
  validationModel,
  headers,
  accessToken,
  data = null
}: FetchInputMethod<T> & { data?: any }) {
  if (!data) {
    return await appFetch<T>({
      input: url,
      validationModel,
      init: {
        method: 'DELETE'
      },
      ctx,
      accessToken
    } as AppFetchInput<T>);
  }

  return await appFetch<T>({
    input: url,
    validationModel,
    init: {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: headers || {
        'Content-Type': JSON_ContentType
      }
    },
    ctx,
    accessToken
  } as AppFetchInput<T>);
}

/**
 * Wrapper around fetch API, with common logic to handle application errors
 * and response bodies.
 *
 * If the server returns 401 Unauthorized, this method tries once to obtain new
 * tokens silently. If that succeeds, the application flow continues
 * transparently, by repeating the original web request with a new token.
 */
async function appFetch<T>({
  ctx,
  input,
  init,
  accessToken,
  validationModel
}: AppFetchInput<T>): Promise<InferredZodeTypeOrCustom<T>> {
  if (init === undefined) {
    if (typeof accessToken === 'string') {
      init = {
        headers: Object.assign({}, { Authorization: `Bearer ${accessToken}` }, CustomHeaders)
      };
    } else {
      init = {
        headers: Object.assign({}, await getAuthorizationHeader(ctx), CustomHeaders)
      };
    }
  } else {
    let headers = Object.assign({}, init.headers, CustomHeaders);
    const authorizationHeader = headers['Authorization'];

    if (!authorizationHeader) {
      if (typeof accessToken === 'string') {
        headers = { ...headers, Authorization: `Bearer ${accessToken}` } as Record<string, string>;
      } else {
        headers = { ...headers, ...(await getAuthorizationHeader(ctx)) };
      }
    }

    init = {
      ...init,
      headers: headers
    };
  }

  if (typeof input === 'string') {
    if (!input.startsWith(process.env.NEXT_PUBLIC_BACKEND_API_URL)) {
      if (process.env.NEXT_PUBLIC_BACKEND_API_URL.at(-1) === '/' && input.startsWith('/')) {
        input = input.slice(1);
      }

      input = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${input}`;
    }
  }

  const response = await fetch(input, init);

  if (response.status === 404) {
    throw new NotFoundError();
  }

  if (response.status === 409) {
    throw new ConflictError();
  }

  if (response.status === 412) {
    throw new PreconditionFailedError();
  }

  let data = await tryParseBodyAsJSON(response);

  if (response.status >= 400) {
    throw new ApplicationError('Response status does not indicate success', response.status, data);
  }

  if (validationModel) {
    data = validationModel.parse(data);
  }

  return data;
}

async function getAuthorizationHeader(ctx?: CtxOrReq): Promise<{ [key: string]: string }> {
  const session = await getSession(ctx);

  if (session?.accessToken) {
    return { Authorization: `Bearer ${session.accessToken}` };
  }

  const response = await fetch(`${process.env.AUTH0_DOMAIN}/oauth/token/`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE
    })
  });

  const jsonResponse = await response.json();
  const accessToken = jsonResponse['access_token'] as string;

  return {
    Authorization: `Bearer ${accessToken}`
  };
}

async function tryParseBodyAsJSON(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');

  if (contentType !== null && contentType.indexOf('json') > -1) {
    return await response.json();
  }

  return await response.text();
}
