import { useEffect, useRef } from 'react';
import { createWebsocket } from '@/lib/api/websockets';
import { useSession } from '@/hooks/use-session';
import { DEBUG } from '@/constants';

type AuthData = Record<string, Record<string, unknown>>;

export const useWebsocket = () => {
  const websocketRef = useRef<ReturnType<typeof createWebsocket> | null>(null);
  const { session } = useSession();

  useEffect(() => {
    websocketRef.current = createWebsocket(session.accessToken);
    websocketRef.current.connect();
    if (DEBUG) {
      websocketRef.current.on('disconnect', () => {
        console.log('on disconnect');
      });
      websocketRef.current.on('connect', () => {
        console.log(
          `on reconnect, socket exists: ${Boolean(websocketRef.current)}, recovered: ${
            websocketRef.current?.recovered
          }, id: ${websocketRef.current?.id}`
        );
      });

      websocketRef.current.onAny(() => {
        console.log(`Last updated: ${(websocketRef.current!.auth as AuthData).data.last_updated}`);
        (websocketRef.current!.auth as AuthData).data.last_updated = Date.now();
      });
    }

    return () => {
      websocketRef.current?.disconnect();
    };
  }, [session.accessToken]);

  return websocketRef.current;
};
