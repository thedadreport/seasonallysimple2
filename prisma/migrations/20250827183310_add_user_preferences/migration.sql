-- CreateTable
CREATE TABLE "public"."UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cookingSkill" TEXT NOT NULL DEFAULT 'Intermediate (some techniques)',
    "dietaryRestrictions" TEXT[] DEFAULT ARRAY['None']::TEXT[],
    "cuisinePreferences" TEXT[] DEFAULT ARRAY['No Preference']::TEXT[],
    "cookingMethods" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "useSeasonalIngredients" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "public"."UserPreferences"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
