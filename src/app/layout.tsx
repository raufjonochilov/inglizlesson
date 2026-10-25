import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LinguaPulse AI — Zamonaviy Ingliz Tili Ta\'lim Platformasi',
  description: 'AI Speaking Partner, Grammatika tahlili, IELTS imtihon simulyatori, Talaffuz va Lug\'at yodlash platformasi',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  applicationName: 'LinguaPulse AI',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LinguaPulse AI',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="dark">
      <body className="antialiased selection:bg-indigo-500 selection:text-white bg-[#0f172a]">
        {children}
      </body>
    </html>
  );
}
