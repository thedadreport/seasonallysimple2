import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { AppProvider } from '../contexts/AppContext';
import AuthProvider from '../components/AuthProvider';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <AppProvider>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}