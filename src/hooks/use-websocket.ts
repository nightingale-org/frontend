import { useEffect, useRef } from 'react';
import { createWebsocket } from '@/lib/api/websockets';
import { useSession } from '@/hooks/use-session';

export const useWebsocket = () => {
  const websocketRef = useRef<ReturnType<typeof createWebsocket> | null>(null);
  const { session } = useSession();

  useEffect(() => {
    websocketRef.current = createWebsocket(session.accessToken);
    websocketRef.current.connect();

    return () => {
      websocketRef.current?.disconnect();
    };
  }, [session.accessToken]);

  return websocketRef.current;
};
