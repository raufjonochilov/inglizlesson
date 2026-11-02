import type { Metadata, Viewport } from 'next';
import './globals.css';
import './modern.css';
import './stage.css';

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
  themeColor: '#f2f6ff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="antialiased selection:bg-blue-700 selection:text-white bg-[#f2f6ff]">
        {children}
      </body>
    </html>
  );
}
