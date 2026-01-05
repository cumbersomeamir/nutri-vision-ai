
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, NutritionalPlan } from "../types";

// Always initialize with the exact environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNutritionalPlan = async (profile: UserProfile): Promise<NutritionalPlan> => {
  const prompt = `
    Generate a comprehensive 1-day personalized nutritional plan for the following user:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Weight: ${profile.weight}kg
    - Height: ${profile.height}cm
    - Activity Level: ${profile.activityLevel}
    - Goal: ${profile.goal}
    - Dietary Restrictions: ${profile.dietaryRestrictions.join(", ") || "None"}

    Ensure the calorie and macro counts are scientifically accurate for their goals.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dailyPlan: {
            type: Type.OBJECT,
            properties: {
              totalCalories: { type: Type.NUMBER },
              totalMacros: {
                type: Type.OBJECT,
                properties: {
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fats: { type: Type.NUMBER },
                },
                required: ["protein", "carbs", "fats"]
              },
              meals: {
                type: Type.OBJECT,
                properties: {
                  breakfast: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      calories: { type: Type.NUMBER },
                      macros: {
                        type: Type.OBJECT,
                        properties: {
                          protein: { type: Type.NUMBER },
                          carbs: { type: Type.NUMBER },
                          fats: { type: Type.NUMBER },
                        },
                        required: ["protein", "carbs", "fats"]
                      }
                    },
                    required: ["name", "description", "calories", "macros"]
                  },
                  lunch: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      calories: { type: Type.NUMBER },
                      macros: {
                        type: Type.OBJECT,
                        properties: {
                          protein: { type: Type.NUMBER },
                          carbs: { type: Type.NUMBER },
                          fats: { type: Type.NUMBER },
                        },
                        required: ["protein", "carbs", "fats"]
                      }
                    },
                    required: ["name", "description", "calories", "macros"]
                  },
                  dinner: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      calories: { type: Type.NUMBER },
                      macros: {
                        type: Type.OBJECT,
                        properties: {
                          protein: { type: Type.NUMBER },
                          carbs: { type: Type.NUMBER },
                          fats: { type: Type.NUMBER },
                        },
                        required: ["protein", "carbs", "fats"]
                      }
                    },
                    required: ["name", "description", "calories", "macros"]
                  },
                  snacks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        calories: { type: Type.NUMBER },
                        macros: {
                          type: Type.OBJECT,
                          properties: {
                            protein: { type: Type.NUMBER },
                            carbs: { type: Type.NUMBER },
                            fats: { type: Type.NUMBER },
                          },
                          required: ["protein", "carbs", "fats"]
                        }
                      },
                      required: ["name", "description", "calories", "macros"]
                    }
                  }
                },
                required: ["breakfast", "lunch", "dinner", "snacks"]
              },
              advice: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["totalCalories", "totalMacros", "meals", "advice"]
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["dailyPlan", "recommendations", "tips"],
        propertyOrdering: ["dailyPlan", "recommendations", "tips"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate plan text");
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON Parse Error:", text);
    throw new Error("Invalid response format from AI");
  }
};

export const generatePlanImage = async (plan: NutritionalPlan): Promise<string> => {
  const mealSummary = `
    Breakfast: ${plan.dailyPlan.meals.breakfast.name} (${plan.dailyPlan.meals.breakfast.calories}kcal)
    Lunch: ${plan.dailyPlan.meals.lunch.name} (${plan.dailyPlan.meals.lunch.calories}kcal)
    Dinner: ${plan.dailyPlan.meals.dinner.name} (${plan.dailyPlan.meals.dinner.calories}kcal)
    Total Daily Calories: ${plan.dailyPlan.totalCalories} kcal
    Total Macros: Protein ${plan.dailyPlan.totalMacros.protein}g, Carbs ${plan.dailyPlan.totalMacros.carbs}g, Fat ${plan.dailyPlan.totalMacros.fats}g
  `;

  const prompt = `
    Create a professional and vibrant nutritional infographic for this daily meal plan.
    Data to include prominently:
    ${mealSummary}
    
    Visual requirements:
    - Use high-contrast typography (dark text on light backgrounds or vice-versa).
    - Modern, clean layout with sections for Breakfast, Lunch, and Dinner.
    - Vibrant, fresh food photography (e.g., green vegetables, protein sources, berries).
    - Background should be light and clean.
    - NO blurry text; ensure the numbers and meal names are clear and legible.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  const candidate = response.candidates?.[0];
  if (!candidate || !candidate.content || !candidate.content.parts) {
    throw new Error("No image generated by the model");
  }

  for (const part of candidate.content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to extract image data from AI response");
};
