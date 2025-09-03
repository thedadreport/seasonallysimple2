import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getPrismaClient } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  // Database adapter temporarily disabled to fix Vercel build issues
  // User data persistence is handled by our custom API routes
  // adapter: undefined,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        action: { label: 'Action', type: 'text' } // 'signin' or 'signup'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const prisma = getPrismaClient();
        if (!prisma) {
          throw new Error('Database connection failed');
        }

        try {
          const { email, password, action } = credentials;

          if (action === 'signup') {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
              where: { email }
            });

            if (existingUser) {
              throw new Error('User already exists with this email');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create user
            const user = await prisma.user.create({
              data: {
                email,
                password: hashedPassword,
                name: email.split('@')[0], // Use email prefix as initial name
              }
            });

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          } else {
            // Sign in
            const user = await prisma.user.findUnique({
              where: { email }
            });

            if (!user || !user.password) {
              throw new Error('Invalid email or password');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
              throw new Error('Invalid email or password');
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          }
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
    
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