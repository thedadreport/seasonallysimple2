import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { AppProvider } from '../contexts/AppContext';
import AuthProvider from '../components/AuthProvider';
import PWAManager from '../components/PWAManager';
import OfflineIndicator from '../components/OfflineIndicator';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Seasonally Simple - AI-Powered Family Meal Planning',
  description: 'Turn dinner stress into family joy with AI-powered recipes that solve real dinner problems.',
  keywords: ['meal planning', 'family recipes', 'AI cooking', 'dinner ideas', 'weekly meal planner'],
  authors: [{ name: 'Seasonally Simple' }],
  creator: 'Seasonally Simple',
  publisher: 'Seasonally Simple',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Seasonally Simple'
  },
  openGraph: {
    title: 'Seasonally Simple - AI-Powered Family Meal Planning',
    description: 'Turn dinner stress into family joy with AI-powered recipes that solve real dinner problems.',
    url: 'https://seasonally-simple.com',
    siteName: 'Seasonally Simple',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seasonally Simple - AI-Powered Family Meal Planning',
    description: 'Turn dinner stress into family joy with AI-powered recipes that solve real dinner problems.',
    creator: '@seasonallysimple',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#7c9885',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Seasonally Simple" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Seasonally Simple" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#7c9885" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Icons */}
        <link rel="icon" type="image/svg+xml" href="/icon-192x192.svg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/icon-192x192.png" />
      </head>
      <body className="font-light bg-gradient-to-br from-stone-50 via-rose-50/20 to-amber-50/30 text-stone-700">
        <AuthProvider>
          <AppProvider>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <PWAManager />
            <OfflineIndicator />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}