'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChefHat, Calendar, BookOpen } from 'lucide-react';

const BottomNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/', 
      label: 'Home', 
      icon: Home 
    },
    { 
      href: '/recipe', 
      label: 'Recipe', 
      icon: ChefHat 
    },
    { 
      href: '/meal-plan', 
      label: 'Meal Plan', 
      icon: Calendar 
    },
    { 
      href: '/saved', 
      label: 'My Recipes', 
      icon: BookOpen 
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200">
        <div className="safe-area-inset-bottom">
          <div className="flex items-center justify-around py-1.5 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-0 flex-1 transition-all duration-200 rounded-lg ${
                    active
                      ? 'text-stone-800 transform scale-105'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Icon 
                    className={`h-5 w-5 mb-0.5 transition-all duration-200 ${
                      active ? 'fill-current stroke-1' : 'stroke-2'
                    }`} 
                  />
                  <span className={`text-xs leading-tight transition-all duration-200 ${
                    active ? 'font-medium' : 'font-light'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Safe area spacer for devices with home indicator */}
      <div className="md:hidden h-safe-area-inset-bottom bg-white/95"></div>
    </>
  );
};

export default BottomNavigation;