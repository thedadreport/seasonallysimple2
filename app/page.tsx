'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ChefHat, 
  Calendar, 
  ArrowRight, 
  Star, 
  CheckCircle, 
  Utensils, 
  Heart, 
  Sparkles,
  Leaf,
  Users
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/recipe" 
              className="px-8 py-4 bg-sage-600 text-white rounded-xl font-semibold text-lg shadow-sage hover:shadow-warm hover:bg-sage-700 transition-all flex items-center space-x-3"
            >
              <ChefHat className="h-5 w-5" />
              <span>Generate Recipe Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/meal-plan" 
              className="px-8 py-4 bg-warmCream text-sage-800 border-2 border-sage-200 rounded-xl font-semibold text-lg hover:border-sage-300 hover:bg-sage-50 transition-all flex items-center space-x-3"
            >
              <Calendar className="h-5 w-5" />
              <span>Plan My Week</span>
            </Link>
          </div>

          {/* Sign Up CTA */}
          <div className="text-center mb-16">
            <Link 
              href="/auth/signin" 
              className="inline-flex items-center px-6 py-3 bg-cream-100 text-terracotta-700 border-2 border-cream-300 rounded-lg font-semibold hover:bg-cream-200 transition-all space-x-2"
            >
              <span>🌱 Get Started Free - 10 Seconds</span>
            </Link>
            <p className="text-sm text-warmGray-600 mt-2 font-body">
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

      {/* Tools Section */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-warmGray-900 mb-4">Choose Your Cooking Situation</h2>
            <p className="text-xl text-warmGray-600 max-w-2xl mx-auto font-body">
              Every family dinner moment has a delicious solution. Choose the tool that fits your evening.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Single Recipe Tool */}
            <div className="bg-softWhite rounded-2xl shadow-warm border border-warmGray-200 overflow-hidden hover:shadow-sage transition-all">
              <div className="bg-gradient-to-br from-terracotta-50 to-cream-50 p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-terracotta-500 to-copper-500 rounded-xl flex items-center justify-center mb-6">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-warmGray-900 mb-4">Tonight's Dinner Inspiration</h3>
                <p className="text-warmGray-700 text-lg mb-6 font-body">
                  It's 5pm, the kids are hungry, and you're ready to transform what you have into something wonderful.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-warmGray-700 font-body">
                    <CheckCircle className="h-5 w-5 text-sage-500 mr-3 flex-shrink-0" />
                    <span>"Protein + whatever's fresh" recipes</span>
                  </div>
                  <div className="flex items-center text-warmGray-700 font-body">
                    <CheckCircle className="h-5 w-5 text-sage-500 mr-3 flex-shrink-0" />
                    <span>Stretch portions when friends drop by</span>
                  </div>
                  <div className="flex items-center text-warmGray-700 font-body">
                    <CheckCircle className="h-5 w-5 text-sage-500 mr-3 flex-shrink-0" />
                    <span>One-pot comfort for busy evenings</span>
                  </div>
                  <div className="flex items-center text-warmGray-700 font-body">
                    <CheckCircle className="h-5 w-5 text-sage-500 mr-3 flex-shrink-0" />
                    <span>Recipes that love being leftovers</span>
                  </div>
                </div>

                <Link 
                  href="/recipe"
                  className="w-full px-6 py-4 bg-gradient-to-r from-terracotta-500 to-copper-500 text-white rounded-xl font-semibold text-lg hover:from-terracotta-600 hover:to-copper-600 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Create Tonight's Magic</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Weekly Planning Tool */}
            <div className="bg-softWhite rounded-2xl shadow-warm border border-warmGray-200 overflow-hidden hover:shadow-sage transition-all">
              <div className="bg-gradient-to-br from-sage-50 to-cream-50 p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-navy-500 rounded-xl flex items-center justify-center mb-6">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-warmGray-900 mb-4">This Week's Nourishing Plan</h3>
                <p className="text-warmGray-700 text-lg mb-6 font-body">
                  A gentle Sunday ritual that transforms your week. One thoughtful session, seven days of delicious ease.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-warmGray-700 font-body">
                    <CheckCircle className="h-5 w-5 text-sage-500 mr-3 flex-shrink-0" />
                    <span>Thoughtful weekly meal harmony</span>
                  </div>
                  <div className="flex items-center text-warmGray-700 font-body">
                    <CheckCircle className="h-5 w-5 text-sage-500 mr-3 flex-shrink-0" />
                    <span>Mindful shopping lists with care</span>
                  </div>
                  <div className="flex items-center text-warmGray-700 font-body">
                    <CheckCircle className="h-5 w-5 text-sage-500 mr-3 flex-shrink-0" />
                    <span>Gentle Sunday prep rhythms</span>
                  </div>
                  <div className="flex items-center text-warmGray-700 font-body">
                    <CheckCircle className="h-5 w-5 text-sage-500 mr-3 flex-shrink-0" />
                    <span>Plans that honor your life's flow</span>
                  </div>
                </div>

                <Link 
                  href="/meal-plan"
                  className="w-full px-6 py-4 bg-gradient-to-r from-sage-500 to-navy-500 text-white rounded-xl font-semibold text-lg hover:from-sage-600 hover:to-navy-600 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Plan My Week</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-softWhite">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-warmGray-900 mb-4">How It Works</h2>
            <p className="text-xl text-warmGray-600 max-w-2xl mx-auto font-body">
              Inspired by the best home cooks - Ina's confidence, Alice's seasonal wisdom, 
              and the beautiful imperfection of real family kitchens.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-sage-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-warmGray-900 mb-4">Share Your Moment</h3>
              <p className="text-warmGray-600 leading-relaxed font-body">
                Tell us about your family, what's fresh in your kitchen, and the kind of evening you're hoping to create.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-terracotta-500 to-copper-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-warmGray-900 mb-4">We Craft Your Recipe</h3>
              <p className="text-warmGray-600 leading-relaxed font-body">
                Our thoughtful AI, inspired by great home cooks, creates a recipe that honors your ingredients and your time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cream-500 to-cream-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-warmGray-900 mb-4">Cook & Make It Yours</h3>
              <p className="text-warmGray-600 leading-relaxed font-body">
                Save your favorites, add personal touches, and let each recipe evolve with your family's tastes.
              </p>
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-navy-800 to-sage-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="h-8 w-8 text-cream-300 mr-3" />
            <h2 className="text-4xl font-display font-bold">Ready to Transform Tonight's Dinner?</h2>
          </div>
          <p className="text-xl text-sage-100 mb-12 max-w-2xl mx-auto font-body">
            Let go of dinner stress. Create something nourishing with one recipe or plan your whole week - 
            both paths begin here, free and simple.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/recipe"
              className="px-8 py-4 bg-warmCream text-sage-800 rounded-xl font-semibold text-lg hover:bg-sage-50 transition-all flex items-center space-x-3"
            >
              <ChefHat className="h-5 w-5" />
              <span>Create Recipe Magic</span>
            </Link>
            <Link 
              href="/meal-plan"
              className="px-8 py-4 bg-transparent border-2 border-cream-200 text-cream-100 rounded-xl font-semibold text-lg hover:bg-cream-100 hover:text-sage-800 transition-all flex items-center space-x-3"
            >
              <Calendar className="h-5 w-5" />
              <span>Plan My Week</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}