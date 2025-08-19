import { Recipe, MealPlan } from '@/types';
import { generateId, formatDate } from './storage';

export const createTestRecipe = (): Recipe => ({
  id: generateId(),
  title: "One-Pot Chicken & Rice with Whatever's in Your Fridge",
  description: "Perfect for those 'protein + random stuff' situations. This forgiving recipe works with whatever vegetables you have on hand.",
  cookTime: "25 minutes",
  servings: "4-6 people", 
  difficulty: "Easy",
  tags: ["One-Pot", "Family-Friendly", "Flexible", "Comfort Food"],
  situation: "Tonight's Dinner Crisis",
  ingredients: [
    "1½ lbs chicken thighs (or whatever protein you have)",
    "1½ cups jasmine rice",
    "3 cups chicken broth (or water + bouillon)",
    "1 large onion, diced",
    "3 cloves garlic, minced",
    "2 carrots, diced (or any hard vegetables)",
    "1 bell pepper, diced (optional)",
    "1 cup frozen peas (or any quick-cooking vegetables)",
    "2 tbsp olive oil",
    "1 tsp paprika",
    "1 tsp dried thyme",
    "Salt and pepper to taste"
  ],
  instructions: [
    "Heat olive oil in a large pot or dutch oven over medium-high heat. Season chicken with salt, pepper, and paprika.",
    "Brown chicken pieces on both sides (about 6 minutes total). Remove and set aside - they don't need to be fully cooked.",
    "In the same pot, sauté onion and garlic until fragrant (2-3 minutes). Add harder vegetables like carrots.",
    "Add rice and stir for 1 minute to lightly toast. Pour in broth and add thyme.",
    "Nestle chicken back into the rice mixture. Bring to a boil, then reduce heat to low and cover.",
    "Simmer for 18-20 minutes until rice is tender and chicken is cooked through.",
    "In the last 5 minutes, add quick-cooking vegetables like bell peppers and frozen peas.",
    "Let rest for 5 minutes before serving. Taste and adjust seasoning."
  ],
  tips: [
    "No chicken thighs? Use chicken breasts (reduce cooking time) or even leftover rotisserie chicken (add in the last 10 minutes).",
    "Vegetable flexibility: Use what you have - zucchini, green beans, corn, spinach all work great.",
    "Make it yours: Add curry powder for Indian flavors, or diced tomatoes and Italian herbs for a Mediterranean twist.",
    "Leftovers work great for lunch tomorrow - add a fried egg on top!"
  ],
  dateAdded: formatDate(new Date()),
  notes: "Kids love this! Added extra peas last time."
});

export const createTestMealPlan = (): MealPlan => ({
  id: generateId(),
  title: "Budget-Friendly Family Week",
  description: "A complete 5-day meal plan designed for a family of 4, focusing on affordable ingredients and minimal prep time.",
  totalCost: "$87",
  prepTime: "2 hours Sunday prep", 
  servings: "4 people, 5 dinners",
  focus: "Budget-Focused",
  numMeals: 5,
  meals: [
    {
      day: "Monday",
      recipe: "One-Pot Chicken & Rice Skillet",
      prepTime: "5 min",
      cookTime: "25 min",
      cost: "$12",
      ingredients: ["Chicken thighs", "Rice", "Frozen vegetables", "Onion", "Garlic"],
      prepNotes: "Dice onion and garlic Sunday"
    },
    {
      day: "Tuesday", 
      recipe: "Slow Cooker Beef & Bean Chili",
      prepTime: "10 min",
      cookTime: "6 hours",
      cost: "$15",
      ingredients: ["Ground beef", "Canned beans", "Diced tomatoes", "Onion", "Chili powder"],
      prepNotes: "Brown beef Sunday, add to slow cooker Tuesday morning"
    },
    {
      day: "Wednesday",
      recipe: "Pasta with Turkey Meatballs", 
      prepTime: "15 min",
      cookTime: "20 min",
      cost: "$18",
      ingredients: ["Ground turkey", "Pasta", "Marinara sauce", "Breadcrumbs", "Parmesan"],
      prepNotes: "Make meatballs Sunday, freeze until needed"
    },
    {
      day: "Thursday",
      recipe: "Sheet Pan Sausage & Vegetables",
      prepTime: "10 min", 
      cookTime: "30 min",
      cost: "$16",
      ingredients: ["Italian sausage", "Bell peppers", "Zucchini", "Red onion", "Potatoes"],
      prepNotes: "Chop all vegetables Sunday"
    },
    {
      day: "Friday",
      recipe: "Leftover Remix: Chili Mac",
      prepTime: "5 min",
      cookTime: "15 min", 
      cost: "$8",
      ingredients: ["Tuesday's leftover chili", "Pasta", "Cheese", "Green onions"],
      prepNotes: "Use Tuesday's chili + fresh pasta"
    }
  ],
  shoppingList: {
    "Proteins": [
      "2 lbs chicken thighs ($8)",
      "1 lb ground beef ($6)",
      "1 lb ground turkey ($5)",
      "1 lb Italian sausage ($7)"
    ],
    "Pantry": [
      "2 lbs jasmine rice ($3)",
      "1 lb pasta ($2)",
      "Marinara sauce ($3)",
      "Canned beans x2 ($3)",
      "Diced tomatoes ($2)"
    ],
    "Produce": [
      "Yellow onions x3 ($2)", 
      "Bell peppers x3 ($4)",
      "Zucchini x2 ($3)",
      "Small potatoes 2lbs ($3)"
    ],
    "Dairy/Other": [
      "Parmesan cheese ($4)",
      "Shredded cheese ($4)",
      "Breadcrumbs ($2)",
      "Frozen mixed vegetables ($3)"
    ]
  },
  prepSchedule: [
    "Dice all onions and garlic (15 min)",
    "Chop vegetables for sheet pan dinner (20 min)", 
    "Brown ground beef for chili (10 min)",
    "Make and freeze turkey meatballs (30 min)",
    "Cook rice for Monday (20 min)"
  ],
  dateAdded: formatDate(new Date()),
  notes: "Worked great! Kids especially loved the chili mac on Friday."
});