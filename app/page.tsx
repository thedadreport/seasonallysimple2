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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50/30 to-amber-50/40">
      
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-stone-100/60 text-stone-600 rounded-full text-sm font-medium mb-8 border border-stone-200/50">
              <Sparkles className="h-4 w-4 mr-2" />
              Making Wholesome Cooking Simple
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-700 mb-8 leading-tight font-light">
              Turn dinner stress into
              <span className="italic font-normal text-stone-800"> family joy</span>
            </h1>
            <p className="text-lg text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Thoughtful, seasonal recipes that turn everyday ingredients into something special. 
              We make wholesome cooking feel effortlessly achievable.
            </p>
          </div>

          <div className="text-center mb-16">
            <Link 
              href="/auth/signin" 
              className="inline-flex items-center px-10 py-4 bg-stone-700 text-white rounded-full font-medium text-base hover:bg-stone-800 transition-all space-x-2 shadow-sm"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-sm text-stone-500 mt-4 font-light">
              Create unlimited recipes instantly • Just sign in with Google
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-serif font-light text-stone-600 italic">30 seconds</div>
              <div className="text-stone-500 text-sm font-light">to get your recipe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-serif font-light text-stone-600 italic">any occasion</div>
              <div className="text-stone-500 text-sm font-light">dinner problems solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-serif font-light text-stone-600 italic">endless</div>
              <div className="text-stone-500 text-sm font-light">family-tested recipes</div>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-700 mb-6 italic">How it works</h2>
            <p className="text-base text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
              Three gentle steps to transform your kitchen stress into family joy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-stone-100/80 rounded-full flex items-center justify-center mx-auto mb-8 border border-stone-200/50">
                <span className="text-2xl font-serif font-light text-stone-600 italic">1</span>
              </div>
              <h3 className="text-xl font-serif font-light text-stone-700 mb-4 italic">Tell us what you have</h3>
              <p className="text-stone-600 leading-relaxed font-light text-sm">
                Share your ingredients, dietary needs, and time. Whether it's "chicken and whatever's fresh" or a full pantry - we work with what you've got.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-rose-50/60 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-100">
                <span className="text-2xl font-serif font-light text-stone-600 italic">2</span>
              </div>
              <h3 className="text-xl font-serif font-light text-stone-700 mb-4 italic">Get your perfect recipe</h3>
              <p className="text-stone-600 leading-relaxed font-light text-sm">
                Our thoughtful AI creates a personalized recipe tailored to your family's tastes and the season. Every recipe is approachable and delicious.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-amber-50/60 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-100">
                <span className="text-2xl font-serif font-light text-stone-600 italic">3</span>
              </div>
              <h3 className="text-xl font-serif font-light text-stone-700 mb-4 italic">Cook & enjoy</h3>
              <p className="text-stone-600 leading-relaxed font-light text-sm">
                Follow clear, friendly instructions that feel like cooking with a trusted friend. Save your favorites and build your personal collection.
              </p>
            </div>
          </div>

          <div className="text-center mt-20">
            <div className="inline-flex items-center px-6 py-3 bg-stone-50/60 text-stone-600 rounded-full text-sm font-light border border-stone-200/50">
              <Sparkles className="h-4 w-4 mr-2" />
              Ready in under 2 minutes
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-br from-stone-50 to-rose-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-700 mb-6 italic">Real families, real joy</h2>
          <p className="text-base text-stone-600 mb-16 font-light">
            Join families who've discovered the gentle art of stress-free cooking
          </p>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white/80 p-10 rounded-3xl border border-stone-100/50 shadow-sm">
              <div className="flex items-center justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-current mx-0.5" />
                ))}
              </div>
              <p className="text-stone-600 mb-6 italic font-light text-base leading-relaxed">
                "The 'protein + whatever's fresh' magic is real! This gave me something beautiful to make with what I had."
              </p>
              <p className="text-stone-500 font-light text-sm">Sarah M., Mom of 3</p>
            </div>
            
            <div className="bg-white/80 p-10 rounded-3xl border border-stone-100/50 shadow-sm">
              <div className="flex items-center justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-current mx-0.5" />
                ))}
              </div>
              <p className="text-stone-600 mb-6 italic font-light text-base leading-relaxed">
                "Planning became this lovely Sunday ritual. 20 peaceful minutes and my whole week feels nourished."
              </p>
              <p className="text-stone-500 font-light text-sm">Mike T., Dad of 2</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}