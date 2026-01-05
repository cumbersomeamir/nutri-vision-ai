
import React from 'react';
import { NutritionalPlan } from '../types';

interface PlanDisplayProps {
  plan: NutritionalPlan;
  imageUrl: string;
  onReset: () => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, imageUrl, onReset }) => {
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'nutrivision-plan.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Text Plan */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-800">Your Personalized Plan</h2>
            <p className="text-slate-500">Daily Target: {plan.dailyPlan.totalCalories} kcal</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <p className="text-xs text-blue-600 font-semibold uppercase">Protein</p>
              <p className="text-xl font-bold text-blue-800">{plan.dailyPlan.totalMacros.protein}g</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl text-center">
              <p className="text-xs text-orange-600 font-semibold uppercase">Carbs</p>
              <p className="text-xl font-bold text-orange-800">{plan.dailyPlan.totalMacros.carbs}g</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl text-center">
              <p className="text-xs text-emerald-600 font-semibold uppercase">Fats</p>
              <p className="text-xl font-bold text-emerald-800">{plan.dailyPlan.totalMacros.fats}g</p>
            </div>
          </div>

          <div className="space-y-6">
            <MealItem label="Breakfast" meal={plan.dailyPlan.meals.breakfast} color="border-yellow-400" />
            <MealItem label="Lunch" meal={plan.dailyPlan.meals.lunch} color="border-emerald-400" />
            <MealItem label="Dinner" meal={plan.dailyPlan.meals.dinner} color="border-indigo-400" />
            {plan.dailyPlan.meals.snacks.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-700 mb-3">Snacks</h3>
                <div className="space-y-3">
                  {plan.dailyPlan.meals.snacks.map((snack, i) => (
                    <div key={i} className="text-sm p-3 bg-slate-50 rounded-lg">
                      <p className="font-semibold text-slate-800">{snack.name}</p>
                      <p className="text-slate-500">{snack.calories} kcal</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Infographic Section */}
        <div className="w-full md:w-[450px] space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Plan Visualizer</h3>
            <img 
              src={imageUrl} 
              alt="Plan Infographic" 
              className="w-full h-auto rounded-lg shadow-inner mb-4 border border-slate-50"
            />
            <button
              onClick={downloadImage}
              className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Infographic
            </button>
          </div>

          <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Quick Tips
            </h3>
            <ul className="space-y-2 text-emerald-50 text-sm">
              {plan.tips.slice(0, 4).map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <span className="opacity-50">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onReset}
            className="w-full py-3 border-2 border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold transition"
          >
            Create New Plan
          </button>
        </div>
      </div>
    </div>
  );
};

const MealItem: React.FC<{ label: string; meal: any; color: string }> = ({ label, meal, color }) => (
  <div className={`border-l-4 ${color} pl-4 py-2`}>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    <h4 className="text-lg font-bold text-slate-800">{meal.name}</h4>
    <p className="text-slate-600 text-sm mb-2">{meal.description}</p>
    <div className="flex gap-4 text-xs font-medium text-slate-500 bg-slate-50 p-2 rounded-lg inline-flex">
      <span>Cal: {meal.calories}</span>
      <span>P: {meal.macros.protein}g</span>
      <span>C: {meal.macros.carbs}g</span>
      <span>F: {meal.macros.fats}g</span>
    </div>
  </div>
);

export default PlanDisplay;
