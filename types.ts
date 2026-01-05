
export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // in kg
  height: number; // in cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'health_optimization';
  dietaryRestrictions: string[];
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface DailyPlan {
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
  };
  advice: string[];
}

export interface NutritionalPlan {
  dailyPlan: DailyPlan;
  recommendations: string[];
  tips: string[];
}
