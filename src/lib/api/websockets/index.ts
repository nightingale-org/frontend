import { io } from 'socket.io-client';

export const createWebsocket = (accessToken: string) => {
  return io(process.env.NEXT_PUBLIC_BACKEND_API_URL.replace('/api/v1', ''), {
    path: '/ws/socket.io',
    autoConnect: false,
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};
