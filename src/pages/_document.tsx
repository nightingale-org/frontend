import { Head, Html, Main, NextScript } from 'next/document';
import { inter } from '@/lib/fonts';

export default function Document() {
  return (
    <Html lang="en" className={inter.variable}>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.ico" />
        <meta name="theme-color" content="white" />
      </Head>
      <body className="selection:dark:text-primary-500 h-1 min-h-screen bg-gray-50 font-sans text-gray-500 antialiased selection:bg-gray-900 selection:text-white dark:bg-gray-900 selection:dark:bg-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
