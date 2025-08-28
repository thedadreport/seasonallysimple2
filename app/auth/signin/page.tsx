'use client';

import { signIn, getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    getSession().then((session) => {
      if (session) {
        router.push('/');
      }
    });
  }, [router]);

  const handleSignIn = async (provider: string, email?: string) => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await signIn(provider, {
        ...(email && { email }),
        callbackUrl: '/',
        redirect: false,
      });

      if (result?.error) {
        setError('Failed to sign in. Please try again.');
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmCream via-sage-50 to-cream-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-warmGray-900 group-hover:text-sage-700 transition-colors">
              Seasonally Simple
            </span>
          </Link>
        </div>

        {/* Sign In Card */}
        <div className="bg-softWhite rounded-2xl shadow-warm border border-sage-100 p-8">
          <div className="text-center mb-6">
            <ChefHat className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold text-warmGray-900 mb-2">Ready to Transform Dinner Time?</h1>
            <p className="text-warmGray-600 font-body">
              Begin your journey to stress-free, nourishing family meals in just 10 seconds!
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-terracotta-50 border border-terracotta-200 rounded-lg">
              <p className="text-terracotta-700 text-sm font-body">{error}</p>
            </div>
          )}

          <div className="space-y-4">

            <button
              onClick={() => handleSignIn('google')}
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-6 py-4 bg-softWhite border-2 border-sage-200 rounded-xl hover:border-sage-400 hover:bg-sage-50 transition-colors font-semibold font-body text-lg shadow-sage hover:shadow-warm ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? 'Beginning Your Journey...' : '🌱 Begin with Google'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-warmGray-500 font-body">
            By signing in, you agree to our{' '}
            <Link href="/privacy" className="text-sage-600 hover:text-sage-700">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="text-sage-600 hover:text-sage-700">
              Terms of Service
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-warmGray-600 hover:text-warmGray-900 text-sm font-medium font-body"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-softWhite/90 backdrop-blur rounded-lg p-6 border border-sage-100">
          <h3 className="font-semibold text-warmGray-900 mb-4 font-body">🌿 What awaits you:</h3>
          <ul className="space-y-2 text-sm text-warmGray-600 font-body">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-sage-500 rounded-full mr-3"></div>
              <strong>Unlimited recipe inspiration</strong> - No limits, just possibilities
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-terracotta-500 rounded-full mr-3"></div>
              <strong>Mindful meal planning</strong> - Complete with thoughtful shopping lists
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-cream-500 rounded-full mr-3"></div>
              <strong>Save & personalize</strong> - Your family's favorites, all in one place
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-copper-500 rounded-full mr-3"></div>
              <strong>Mobile-friendly</strong> - Cook with gentle guidance in hand
            </li>
          </ul>
          <div className="mt-4 text-xs text-warmGray-500 text-center font-body">
            🔒 We honor your privacy - only your name and email, nothing more
          </div>
        </div>
      </div>
    </div>
  );
}