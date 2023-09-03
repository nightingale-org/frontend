import { io, type Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/lib/api/websockets/types';

export const createWebsocket = (
  accessToken: string
): Socket<ServerToClientEvents, ClientToServerEvents> => {
  return io(process.env.NEXT_PUBLIC_BACKEND_API_URL.replace('/api/v1', ''), {
    path: '/ws/socket.io',
    autoConnect: false,
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`
    },
    auth: {
      data: {
        last_updated: undefined
      }
    }
  });
};
