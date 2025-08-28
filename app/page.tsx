'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Star, 
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warmCream via-sage-50 to-cream-50">
      
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-sage-100 text-sage-800 rounded-full text-sm font-medium mb-6 border border-sage-200">
              <Sparkles className="h-4 w-4 mr-2" />
              Making Wholesome Cooking Simple
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-warmGray-900 mb-6 tracking-tight">
              Turn Dinner Stress Into
              <span className="bg-gradient-to-r from-sage-600 to-terracotta-500 bg-clip-text text-transparent"> Family Joy</span>
            </h1>
            <p className="text-xl text-warmGray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-body">
              Deliciously simple, seasonal recipes that solve real dinner problems. From "what's in my fridge?" to "plan my whole week" - 
              we make wholesome cooking feel effortlessly achievable.
            </p>
          </div>

          <div className="text-center mb-16">
            <Link 
              href="/auth/signin" 
              className="inline-flex items-center px-8 py-4 bg-sage-600 text-white rounded-xl font-semibold text-lg shadow-sage hover:shadow-warm hover:bg-sage-700 transition-all space-x-3"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-sm text-warmGray-600 mt-3 font-body">
              Create unlimited recipes instantly • Just sign in with Google
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-sage-700">30 sec</div>
              <div className="text-warmGray-600 font-body">To get your recipe</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-terracotta-600">6 situations</div>
              <div className="text-warmGray-600 font-body">Real dinner problems solved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-copper-600">∞</div>
              <div className="text-warmGray-600 font-body">Family-tested recipes</div>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-softWhite">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-warmGray-900 mb-4">How It Works</h2>
            <p className="text-xl text-warmGray-600 max-w-3xl mx-auto font-body">
              Three simple steps to transform your kitchen stress into family joy. 
              From pantry ingredients to perfectly crafted meals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-500 to-sage-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sage">
                <span className="text-3xl font-display font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-warmGray-900 mb-4">Tell Us What You Have</h3>
              <p className="text-warmGray-600 leading-relaxed font-body text-lg">
                Share your ingredients, dietary needs, and cooking time. Whether it's "chicken and whatever's in the fridge" or a full pantry - we work with what you've got.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-terracotta-500 to-copper-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-warm">
                <span className="text-3xl font-display font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-warmGray-900 mb-4">Get Your Perfect Recipe</h3>
              <p className="text-warmGray-600 leading-relaxed font-body text-lg">
                Our AI creates a personalized recipe tailored to your family's tastes, your available time, and the season. Every recipe is designed to be approachable and delicious.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cream-500 to-honey-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-warm">
                <span className="text-3xl font-display font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-warmGray-900 mb-4">Cook & Enjoy</h3>
              <p className="text-warmGray-600 leading-relaxed font-body text-lg">
                Follow clear, friendly instructions that feel like cooking with a trusted friend. Save your favorites and build your family's personal recipe collection.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex items-center px-6 py-3 bg-sage-100 text-sage-800 rounded-full text-lg font-medium border border-sage-200">
              <Sparkles className="h-5 w-5 mr-2" />
              Ready in under 2 minutes
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-warmCream to-sage-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold text-warmGray-900 mb-4">Real Families, Real Joy</h2>
          <p className="text-xl text-warmGray-600 mb-12 font-body">
            Join families who've discovered the gentle art of stress-free cooking.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-softWhite p-8 rounded-2xl shadow-warm border border-sage-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-cream-500 fill-current" />
                ))}
              </div>
              <p className="text-warmGray-700 mb-4 italic font-body">
                "The 'protein + whatever's fresh' magic is real! This actually gave me something beautiful to make with what I had."
              </p>
              <p className="text-sage-800 font-semibold">- Sarah M., Mom of 3</p>
            </div>
            
            <div className="bg-softWhite p-8 rounded-2xl shadow-warm border border-sage-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-cream-500 fill-current" />
                ))}
              </div>
              <p className="text-warmGray-700 mb-4 italic font-body">
                "Weekly planning became this lovely Sunday ritual. 20 peaceful minutes and my whole week feels nourished."
              </p>
              <p className="text-sage-800 font-semibold">- Mike T., Dad of 2</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}