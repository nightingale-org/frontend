import './globals.css';
import AuthContext from '@/context/AuthContext';
import ToasterContext from '@/context/ToasterContext';
import { inter, roboto_mono } from '@/libs/fonts';
import dynamic from 'next/dynamic';

const ActiveStatus = dynamic(() => import('@/components/ActiveStatus'), { ssr: false });

export const metadata = {
  title: 'Messenger',
  description: 'Messenger Clone'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
