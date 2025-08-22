'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Leaf, Crown, User, LogOut, LogIn } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useSession, signOut } from 'next-auth/react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { subscription } = useApp();
  const { data: session, status } = useSession();

  const navItems = [
    { href: '/recipe', label: 'Recipes' },
    { href: '/meal-plan', label: 'Meal Plans' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/saved', label: 'My Recipes' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
              Seasonally Simple
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-gray-900 hover:text-green-700 transition-colors font-medium ${
                  isActive(item.href) ? 'text-green-700 font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Subscription Status */}
            <Link
              href="/subscription"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/subscription') 
                  ? 'bg-green-100 text-green-700' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {subscription.tier === 'free' ? (
                <User className="h-4 w-4" />
              ) : (
                <Crown className="h-4 w-4" />
              )}
              <span className="font-medium capitalize">{subscription.tier}</span>
            </Link>
            
            {/* Authentication */}
            {status === 'loading' ? (
              <div className="px-4 py-2 text-gray-500">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                {subscription.tier === 'free' && (
                  <Link 
                    href="/subscription"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Upgrade
                  </Link>
                )}
                
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                </div>
                
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-gray-900 hover:text-green-700 transition-colors font-medium ${
                  isActive(item.href) ? 'text-green-700 font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <Link
              href="/subscription"
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 py-2 text-gray-900 hover:text-green-700 transition-colors font-medium ${
                isActive('/subscription') ? 'text-green-700 font-semibold' : ''
              }`}
            >
              {subscription.tier === 'free' ? (
                <User className="h-4 w-4" />
              ) : (
                <Crown className="h-4 w-4" />
              )}
              <span className="capitalize">{subscription.tier} Plan</span>
            </Link>
            
            {/* Mobile Authentication */}
            {session ? (
              <>
                <div className="flex items-center space-x-3 py-3 border-t border-gray-200">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{session.user?.name}</p>
                    <p className="text-sm text-gray-600">{session.user?.email}</p>
                  </div>
                </div>
                
                {subscription.tier === 'free' && (
                  <div className="pt-2">
                    <Link 
                      href="/subscription"
                      onClick={() => setIsOpen(false)}
                      className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
                    >
                      Upgrade
                    </Link>
                  </div>
                )}
                
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex items-center justify-center w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;