'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Crown, User, LogOut, LogIn, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useSession, signOut } from 'next-auth/react';
import InstallAppButton from './InstallAppButton';

const Navigation = () => {
  const pathname = usePathname();
  const { subscription } = useApp();
  const { data: session, status } = useSession();

  const navItems = [
    { href: '/recipe', label: 'Recipes' },
    { href: '/meal-plan', label: 'Meal Plans' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/saved', label: 'My Recipes' },
    { href: '/preferences', label: 'Preferences' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center transition-all group-hover:bg-stone-200">
              <Leaf className="h-5 w-5 text-stone-600" />
            </div>
            <span className="text-xl font-serif font-light text-stone-700 italic group-hover:text-stone-800 transition-colors">
              Seasonally Simple
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-stone-600 hover:text-stone-800 transition-colors font-light text-sm ${
                  isActive(item.href) ? 'text-stone-800 font-normal' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Subscription Status */}
            <Link
              href="/subscription"
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors text-sm ${
                isActive('/subscription') 
                  ? 'bg-stone-100 text-stone-700' 
                  : 'hover:bg-stone-50 text-stone-600'
              }`}
            >
              {subscription.tier === 'free' ? (
                <User className="h-3 w-3" />
              ) : (
                <Crown className="h-3 w-3" />
              )}
              <span className="font-light capitalize">{subscription.tier}</span>
            </Link>
            
            {/* Authentication */}
            {status === 'loading' ? (
              <div className="px-4 py-2 text-stone-400 font-light text-sm">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                {subscription.tier === 'free' && (
                  <Link 
                    href="/subscription"
                    className="px-4 py-2 bg-stone-700 text-white rounded-full font-light text-sm hover:bg-stone-800 transition-colors"
                  >
                    Upgrade
                  </Link>
                )}
                
                <InstallAppButton />
                
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-light text-stone-600">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                </div>
                
                <Link
                  href="/settings"
                  className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Link>
                
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 px-4 py-2 bg-stone-700 text-white rounded-full font-light text-sm hover:bg-stone-800 transition-colors"
              >
                <LogIn className="h-3 w-3" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Account/Auth Section */}
          <div className="md:hidden flex items-center space-x-2">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-stone-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <Link href="/subscription" className="flex items-center space-x-2">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                {subscription.tier === 'free' ? (
                  <User className="h-4 w-4 text-stone-600" />
                ) : (
                  <Crown className="h-4 w-4 text-stone-600" />
                )}
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="p-2 text-stone-600 hover:text-stone-800 transition-colors"
              >
                <LogIn className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navigation;