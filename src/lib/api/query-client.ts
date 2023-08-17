import { QueryClient, QueryClientConfig } from '@tanstack/react-query';

export function createQueryClient(options: QueryClientConfig = {}) {
  return new QueryClient({
    ...options,
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  });
}
