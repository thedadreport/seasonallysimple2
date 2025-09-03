'use client';

import { signIn, getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat, Leaf, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    getSession().then((session) => {
      if (session) {
        router.push('/');
      }
    });
  }, [router]);

  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await signIn(provider, {
        callbackUrl: '/preferences?onboarding=true',
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const result = await signIn('credentials', {
        email,
        password,
        action: isSignUp ? 'signup' : 'signin',
        callbackUrl: '/preferences?onboarding=true',
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50/30 to-amber-50/40 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center transition-all group-hover:bg-stone-200">
              <Leaf className="h-6 w-6 text-stone-600" />
            </div>
            <span className="text-xl font-serif font-light text-stone-700 italic group-hover:text-stone-800 transition-colors">
              Seasonally Simple
            </span>
          </Link>
        </div>

        {/* Sign In Card */}
        <div className="bg-white/80 rounded-3xl border border-stone-100/50 p-10 shadow-sm">
          <div className="text-center mb-8">
            <ChefHat className="h-10 w-10 text-stone-600 mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-serif font-light text-stone-700 mb-4 italic">Ready to transform dinner time?</h1>
            <p className="text-stone-600 font-light leading-relaxed">
              Begin your journey to stress-free, nourishing family meals
            </p>
          </div>

          {error && (
            <div className="mb-8 p-6 bg-rose-50/50 border border-rose-200/50 rounded-2xl">
              <p className="text-rose-700 text-sm font-light">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-stone-400" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 border border-stone-200 rounded-full focus:outline-none focus:border-stone-300 focus:ring-1 focus:ring-stone-300 font-light text-base placeholder:text-stone-400"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/80 border border-stone-200 rounded-full focus:outline-none focus:border-stone-300 focus:ring-1 focus:ring-stone-300 font-light text-base placeholder:text-stone-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Confirm Password (Sign Up Only) */}
              {isSignUp && (
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/80 border border-stone-200 rounded-full focus:outline-none focus:border-stone-300 focus:ring-1 focus:ring-stone-300 font-light text-base placeholder:text-stone-400"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center px-8 py-4 bg-stone-700 text-white rounded-full hover:bg-stone-800 transition-all font-light text-base shadow-sm ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  'Beginning your journey...'
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>

              {/* Toggle Sign In/Up */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-stone-600 hover:text-stone-800 text-sm font-light underline"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-stone-500 font-light">or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={() => handleSignIn('google')}
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-8 py-4 bg-white border border-stone-200 rounded-full hover:border-stone-300 hover:bg-stone-50 transition-all font-light text-base shadow-sm ${
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
              Continue with Google
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-stone-500 font-light">
            By signing in, you agree to our{' '}
            <Link href="/privacy" className="text-stone-600 hover:text-stone-700">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="text-stone-600 hover:text-stone-700">
              Terms of Service
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-stone-500 hover:text-stone-700 text-sm font-light"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-10 bg-white/60 backdrop-blur rounded-2xl p-8 border border-stone-100/50">
          <h3 className="font-light text-stone-700 mb-6 text-center italic">What awaits you</h3>
          <ul className="space-y-3 text-sm text-stone-600 font-light">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-stone-400 rounded-full mr-4"></div>
              <span className="font-normal">Unlimited recipe inspiration</span> - No limits, just possibilities
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-stone-400 rounded-full mr-4"></div>
              <span className="font-normal">Mindful meal planning</span> - Complete with thoughtful shopping lists
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-stone-400 rounded-full mr-4"></div>
              <span className="font-normal">Save & personalize</span> - Your family's favorites, all in one place
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-stone-400 rounded-full mr-4"></div>
              <span className="font-normal">Mobile-friendly</span> - Cook with gentle guidance in hand
            </li>
          </ul>
          <div className="mt-6 text-xs text-stone-500 text-center font-light">
            We honor your privacy - only your name and email, nothing more
          </div>
        </div>
      </div>
    </div>
  );
}