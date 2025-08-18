# Seasonally Simple

AI-powered meal planning that turns dinner stress into family joy.

## 🌿 About

Seasonally Simple is a Next.js 14 application that helps busy families solve dinner problems with AI-generated recipes and meal plans. Inspired by the wisdom of great home cooks like Ina Garten and Alice Waters, our app provides practical solutions for real cooking situations.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seasonally-simple
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   # Public Environment Variables
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Private Environment Variables  
   ANTHROPIC_API_KEY=your_anthropic_api_key
   SUPABASE_SERVICE_KEY=your_service_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
seasonally-simple/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Landing page
│   ├── recipe/            # Recipe generator
│   ├── meal-plan/         # Weekly meal planner
│   ├── saved/             # Saved recipes & plans
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # Base UI components
│   ├── recipe/            # Recipe-specific components
│   └── meal-plan/         # Meal planning components
├── lib/                   # Utilities and integrations
│   ├── types/             # TypeScript type definitions
│   ├── anthropic.ts       # AI integration
│   ├── supabase.ts        # Database integration
│   └── utils.ts           # Utility functions
└── styles/                # Global styles and design system
    └── globals.css
```

## 🎨 Design System

### Color Palette
- **Sage Green**: `#87A96B` (primary)
- **Warm Brown**: `#8B4513` (secondary)  
- **Cream**: `#FFF8DC` (background)
- **Charcoal**: `#36454F` (text)
- **Clay**: `#C4A57B` (accent)
- **Olive**: `#708238` (accent)
- **Rust**: `#B7410E` (accent)

### Typography
- **Headers**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components
All components follow the War Kitchen-inspired aesthetic with:
- Organic rounded corners
- Subtle paper textures
- Natural shadow effects
- Warm, earthy colors

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

1. Create component in appropriate directory (`components/ui/`, `components/recipe/`, etc.)
2. Use TypeScript for type safety
3. Follow the design system classes
4. Add proper accessibility attributes

### Environment Setup

The app is configured to work with:
- **Anthropic Claude API** for recipe generation
- **Supabase** for data persistence
- **Vercel** for deployment

## 🔧 Configuration

### Tailwind CSS
Custom design system configured in `tailwind.config.ts` with:
- War Kitchen-inspired color palette
- Custom font families
- Organic component classes

### TypeScript
Strict TypeScript configuration with:
- Path aliases (`@/` for root)
- Proper type definitions
- Component prop interfaces

## 📊 Features

### Current Features
- ✅ Responsive design with War Kitchen aesthetic
- ✅ Next.js 14 App Router structure
- ✅ TypeScript type safety
- ✅ Custom design system
- ✅ Navigation and routing
- ✅ Landing page with hero and features

### Coming Soon
- 🚧 Recipe generator with AI integration
- 🚧 Weekly meal planner
- 🚧 User authentication
- 🚧 Recipe saving and favorites
- 🚧 Shopping list generation
- 🚧 Prep schedule optimization

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use TypeScript for all new files
- Follow the existing component patterns
- Use the design system classes
- Add proper TypeScript types
- Write descriptive commit messages

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support, email hello@seasonally-simple.com or open an issue in the repository.

---

**Built with ❤️ for busy families who want to turn dinner stress into family joy** 🌿# seasonallysimple2
