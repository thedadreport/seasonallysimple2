# Seasonally Simple - Development Documentation

## 🎯 Project Overview
A subscription-based AI meal planning app built with Next.js, featuring Google OAuth authentication, Supabase database, and tiered subscription system.

**Live App:** https://seasonallysimple2.vercel.app
**GitHub:** https://github.com/thedadreport/seasonallysimple2

## 🎨 Brand Guidelines

**Core Promise**: "Making wholesome, seasonal cooking deliciously simple for busy families"

**Brand Personality**:
- Warm and nurturing
- Authentically imperfect
- Knowledgeable but approachable
- Gently humorous
- Practically luxurious

### Target Audience
**Primary**: 
- Millennial and Gen X mothers (28-45)
- Health-conscious but not extreme
- Middle to upper-middle income
- Values quality over convenience
- Interested in wellness but skeptical of trends

**Secondary**:
- Health-conscious individuals
- People with dietary restrictions
- Home cooks looking to level up their skills
- Those interested in seasonal living

### Visual Identity

**Color Palette**:
- Primary: Warm cream, sage green, soft terracotta
- Secondary: Muted navy, golden honey
- Accent: Copper metallic

**Visual Elements**:
- Clean, minimalist photography
- Natural textures (linen, ceramic, wood)
- Soft, natural lighting
- Seasonal color transitions in content
- Minimal props, focus on food and ingredients

## ✅ Completed Features

### 🔐 Authentication System
- **NextAuth.js** with Google OAuth integration
- **Supabase database adapter** for user persistence
- Custom sign-in/error pages with demo authentication
- **Production Google OAuth** configured and working
- Session management with database storage

### 💳 Subscription System
- **Three tiers:** Free (5 recipes/month), Pro ($9.99 - 50 recipes + meal plans), Family ($19.99 - 100 recipes + more)
- **Usage tracking** with monthly limits and automatic reset
- **Feature gates:** Meal plans Pro+ only, recipe editing Pro+ only
- **Subscription management** page with upgrade/downgrade
- Demo subscription switching for testing

### 🎨 User Interface
- **Professional design** with Tailwind CSS v3.4.16
- **Responsive navigation** with user status and subscription tier
- **Recipe generator** with usage limits and test data
- **Meal planner** with subscription gates and complete plans
- **Saved items page** with edit permissions based on subscription
- **Subscription upgrade components** (reusable)

### 🗄️ Database Integration
- **Supabase PostgreSQL** database connected
- **Prisma ORM** with complete schema and migrations
- **User tables:** User, Account, Session, VerificationToken
- **App tables:** Subscription, UsageStats, Recipe, MealPlan
- **Foreign keys and relationships** properly configured
- **NextAuth database adapter** implemented

### 🚀 Deployment
- **Vercel deployment** with automatic deployments on push
- **Environment variables** configured for production
- **Build process** optimized and error-free
- **Google OAuth** working in production

## 🏗️ Technical Stack

```
Frontend: Next.js 14 + React + TypeScript
Styling: Tailwind CSS v3.4.16
Authentication: NextAuth.js + Google OAuth
Database: Supabase PostgreSQL + Prisma ORM
Deployment: Vercel
State Management: React Context + localStorage (transitioning to database)
```

## 📁 Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/route.ts   # NextAuth configuration
│   ├── auth/                             # Authentication pages
│   ├── recipe/page.tsx                   # Recipe generator
│   ├── meal-plan/page.tsx               # Meal planner (Pro+ feature)
│   ├── saved/page.tsx                   # Saved recipes/plans
│   ├── subscription/page.tsx            # Subscription management
│   └── layout.tsx                       # Root layout with providers
├── components/
│   ├── Navigation.tsx                   # Main navigation with auth status
│   ├── AuthProvider.tsx                 # NextAuth session provider
│   ├── SubscriptionUpgrade.tsx          # Reusable upgrade prompts
│   └── SubscriptionStatus.tsx           # Subscription dashboard
├── contexts/
│   └── AppContext.tsx                   # Global app state management
├── lib/
│   ├── storage.ts                       # localStorage utilities
│   ├── subscription.ts                  # Subscription logic and limits
│   └── testData.ts                      # Test recipe/meal plan data
├── types/
│   ├── index.ts                         # TypeScript interfaces
│   └── next-auth.d.ts                   # NextAuth type extensions
├── prisma/
│   ├── schema.prisma                    # Database schema
│   └── migrations/                      # Database migrations
└── styles/globals.css                   # Global styles with Tailwind
```

## 🔧 Environment Variables

### Required for Development (.env.local):
```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=0b2tvHu566TUvp38u6ltPvBSMbkTUA00kPMzpQcff7Q=

# Google OAuth (production credentials)
GOOGLE_CLIENT_ID=156761403252
GOOGLE_CLIENT_SECRET=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

# Supabase Database
POSTGRES_URL="postgres://postgres.iwikipbshzlanvhusbiv:tuwEZ36NvxpsAV4r@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
POSTGRES_PRISMA_URL="postgres://postgres.iwikipbshzlanvhusbiv:tuwEZ36NvxpsAV4r@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://postgres.iwikipbshzlanvhusbiv:tuwEZ36NvxpsAV4r@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

### Required for Production (Vercel):
- All above variables with production URLs
- NEXTAUTH_URL should be the Vercel domain

## 🗃️ Database Schema

### User Authentication (NextAuth.js):
- **User:** Basic profile (name, email, image)
- **Account:** OAuth provider links
- **Session:** Active user sessions
- **VerificationToken:** Email verification

### Application Data:
- **Subscription:** User subscription tiers and status
- **UsageStats:** Monthly usage tracking per user
- **Recipe:** User's saved recipes with full content (JSON)
- **MealPlan:** User's meal plans with full data (JSON)

## 🎮 Current User Flow

1. **Sign In:** Google OAuth or demo authentication
2. **Recipe Generation:** Create recipes with usage limits
3. **Meal Planning:** Pro+ users can create weekly meal plans
4. **Save Content:** Recipes and meal plans saved to localStorage
5. **Subscription Management:** Upgrade/downgrade tiers
6. **Edit Permissions:** Pro+ users can edit saved content

## ⚠️ Current Limitations

1. **localStorage Dependency:** Recipe/meal plan data still in browser storage
2. **Test Data Only:** Using mock recipes, not real AI generation
3. **Demo Payments:** Subscription changes are cosmetic only
4. **No API Endpoints:** CRUD operations not yet server-side

## 🚧 Next Development Phase

### Priority 1: Replace localStorage with Database APIs
- Create API endpoints for recipes and meal plans
- Update React Context to use database instead of localStorage
- Implement server-side subscription validation
- Add proper error handling and loading states

### Priority 2: Real AI Integration
- Integrate OpenAI API for recipe generation
- Replace test data with actual AI-generated content
- Add recipe customization and regeneration

### Priority 3: Payment Processing
- Integrate Stripe for subscription payments
- Add webhook handling for subscription updates
- Implement real billing and payment flows

## 🏃‍♂️ Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Database operations
npx prisma migrate dev          # Apply migrations
npx prisma generate            # Generate Prisma client
npx prisma studio             # Open database browser

# Build and deploy
npm run build                 # Build for production
git push origin main          # Auto-deploy to Vercel
```

## 🔍 Testing Checklist

### Authentication:
- [ ] Google OAuth sign-in works
- [ ] Demo sign-in works for development
- [ ] User data appears in Supabase dashboard
- [ ] Sign-out functionality works

### Subscription System:
- [ ] Free tier shows 5 recipe limit
- [ ] Pro tier allows meal plan access
- [ ] Usage counters update correctly
- [ ] Feature gates work properly

### UI/UX:
- [ ] All pages load without errors
- [ ] Navigation shows correct user status
- [ ] Mobile responsive design works
- [ ] Loading states and error handling

## 📞 Support Information

**Database:** Supabase dashboard at https://app.supabase.com/  
**Deployment:** Vercel dashboard  
**Domain:** seasonallysimple2.vercel.app  

## 🎯 Success Metrics

The app currently provides:
- ✅ Professional authentication flow
- ✅ Real user account persistence
- ✅ Subscription-based business model
- ✅ Feature gating and usage limits
- ✅ Production-ready deployment
- ✅ Mobile-responsive design

**Status:** Ready for API development phase to complete the transition from localStorage to full database integration.