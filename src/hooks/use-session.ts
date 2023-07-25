import { useSession as useNextAuthSession } from 'next-auth/react';
import type { Session } from 'next-auth';

type UpdateSession = (data?: any) => Promise<Session | null>;
type UseSessionReturnType = { session: Required<Session>; update: UpdateSession };

export function useSession(): UseSessionReturnType {
  const session = useNextAuthSession();

  if (session.status === 'loading' || session.status === 'unauthenticated') {
    throw new Error(
      'The session is loaded or unauthenticated, which is not acceptable and probably there is some page that uses the component without `auth` on it being set that calls useSession'
    );
  }

  // Middleware should prevent user from being null here, so we can assert that it is not null
  return {
    session: session.data! as unknown as Required<Session>,
    update: session.update as UpdateSession
  };
}
