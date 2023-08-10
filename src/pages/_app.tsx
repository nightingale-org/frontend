import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import { NextPage } from 'next';
import { inter } from '@/lib/fonts';
import { Suspense, useEffect, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import dynamic from 'next/dynamic';

export type NextPageWithLayoutAndAuth<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactElement;
  auth?: { loader: React.ReactElement };
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayoutAndAuth;
};

const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools/build/lib/index.prod.js').then((d) => ({
      default: d.ReactQueryDevtools
    })),
  {
    ssr: false
  }
);

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsWithLayout) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false
          }
        }
      })
  );
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={session}>
          <main className={inter.variable}>
            {Component.auth ? (
              <Auth loader={Component.auth.loader}>{getLayout(<Component {...pageProps} />)}</Auth>
            ) : (
              getLayout(<Component {...pageProps} />)
            )}
            <Toaster />
            {showDevtools && (
              <Suspense fallback={null}>
                <ReactQueryDevtools />
              </Suspense>
            )}
          </main>
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

function Auth({ children, loader }: { children: React.ReactElement; loader?: React.ReactElement }) {
  const { status } = useSession({ required: true });

  if (status === 'loading') {
    return loader ?? null;
  }

  return children;
}
