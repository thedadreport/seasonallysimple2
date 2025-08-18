import React from 'react';
import Link from 'next/link';
import { Instagram, PinIcon as Pinterest, Mail, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Seasonally Simple</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Turn dinner stress into family joy with AI-powered recipes that solve real dinner problems. 
              Made with ❤️ for busy families.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://instagram.com/seasonallysimple" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a 
                href="https://pinterest.com/seasonallysimple" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
              >
                <Pinterest className="h-5 w-5 text-white" />
              </a>
              <a 
                href="mailto:hello@seasonally-simple.com"
                className="p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/recipe" className="block text-gray-300 hover:text-white transition-colors">
                Recipe Generator
              </Link>
              <Link href="/meal-plan" className="block text-gray-300 hover:text-white transition-colors">
                Weekly Planner
              </Link>
              <Link href="/saved" className="block text-gray-300 hover:text-white transition-colors">
                Saved Recipes
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-gray-300 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link href="/privacy" className="block text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Seasonally Simple. All rights reserved.
          </div>
          <div className="text-gray-400 text-sm">
            Crafted with seasonal ingredients and family love 🌿
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;