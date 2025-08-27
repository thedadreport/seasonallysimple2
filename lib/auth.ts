import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  // Database adapter temporarily disabled to fix Vercel build issues
  // User data persistence is handled by our custom API routes
  // adapter: undefined,
  providers: [
    // For development, we'll include a demo credentials provider
    ...(process.env.NODE_ENV === 'development' ? [
      CredentialsProvider({
        id: 'demo',
        name: 'Demo User',
        credentials: {
          email: { label: 'Email', type: 'email' },
        },
        async authorize(credentials) {
          // This is for demo purposes only - never do this in production!
          if (credentials?.email) {
            return {
              id: 'demo-user-' + Date.now(),
              name: 'Demo User',
              email: credentials.email,
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
            };
          }
          return null;
        },
      })
    ] : []),
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For now, allow all sign-ins
      // Later we can add user creation logic here
      return true;
    },
    async session({ session, token }) {
      // Add user ID to session for easy access
      if (session.user) {
        session.user.id = token.sub || '';
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Persist user ID in the token
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    // Use JWT strategy to avoid database dependency during build
    strategy: 'jwt',
  },
};