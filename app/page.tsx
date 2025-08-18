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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6 border border-green-200">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Recipe Solutions
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Turn Dinner Stress Into
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Family Joy</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              AI-powered recipes that solve real dinner problems. From "what's in my fridge?" to "plan my whole week" - 
              we've got the recipe for every family situation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/recipe" 
              className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center space-x-3"
            >
              <ChefHat className="h-5 w-5" />
              <span>Generate Recipe Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/meal-plan" 
              className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-xl font-semibold text-lg hover:border-gray-400 transition-all flex items-center space-x-3"
            >
              <Calendar className="h-5 w-5" />
              <span>Plan My Week</span>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">30 sec</div>
              <div className="text-gray-600">To get your recipe</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">6 situations</div>
              <div className="text-gray-600">Real dinner problems solved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">∞</div>
              <div className="text-gray-600">Family-tested recipes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Cooking Situation</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every family dinner crisis has a solution. Pick your tool based on what you need right now.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Single Recipe Tool */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tonight's Dinner Crisis</h3>
                <p className="text-gray-700 text-lg mb-6">
                  It's 5pm, the kids are hungry, and you're staring into the fridge wondering what's possible.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>"Protein + random stuff" recipes</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Stretch small portions for unexpected guests</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>One-pot solutions for minimal cleanup</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Recipes that work as tomorrow's lunch</span>
                  </div>
                </div>

                <Link 
                  href="/recipe"
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Solve Tonight's Dinner</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Weekly Planning Tool */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">This Week's Meal Plan</h3>
                <p className="text-gray-700 text-lg mb-6">
                  Sunday planning session that sets you up for weeknight success. One session, five dinners solved.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Complete weekly meal plans</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Organized shopping lists with prices</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Sunday prep schedules</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Budget-focused or time-saving plans</span>
                  </div>
                </div>

                <Link 
                  href="/meal-plan"
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center space-x-2"
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
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Inspired by the best home cooks - Ina Garten's confidence, Alice Waters' seasonal focus, 
              and real family cooking wisdom.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tell Us Your Situation</h3>
              <p className="text-gray-600 leading-relaxed">
                Family size, what's in your fridge, how much time you have, and what cooking situation you're facing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Creates Your Recipe</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI, trained on the philosophy of great home cooks, creates recipes that solve your specific dinner problem.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cook & Make It Yours</h3>
              <p className="text-gray-600 leading-relaxed">
                Save recipes, add your own notes, and edit them based on what worked for your family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Real Families, Real Solutions</h2>
          <p className="text-xl text-gray-600 mb-12">
            Join families who've turned their dinner stress into family connection time.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The 'protein + random stuff' situation is my life! This actually gave me a recipe I could make with what I had."
              </p>
              <p className="text-gray-900 font-semibold">- Sarah M., Mom of 3</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Weekly planning used to stress me out. Now I spend 20 minutes on Sunday and I'm set for the week."
              </p>
              <p className="text-gray-900 font-semibold">- Mike T., Dad of 2</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="h-8 w-8 text-green-400 mr-3" />
            <h2 className="text-4xl font-bold">Ready to Solve Tonight's Dinner?</h2>
          </div>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Stop stressing about what's for dinner. Start with one recipe or plan your whole week - 
            both tools are free to try.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/recipe"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all flex items-center space-x-3"
            >
              <ChefHat className="h-5 w-5" />
              <span>Try Recipe Generator</span>
            </Link>
            <Link 
              href="/meal-plan"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all flex items-center space-x-3"
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