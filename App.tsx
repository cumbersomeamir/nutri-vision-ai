
import React, { useState } from 'react';
import { UserProfile, NutritionalPlan } from './types';
import { generateNutritionalPlan, generatePlanImage } from './services/geminiService';
import ProfileForm from './components/ProfileForm';
import PlanDisplay from './components/PlanDisplay';
import LoadingState from './components/LoadingState';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<NutritionalPlan | null>(null);
  const [planImageUrl, setPlanImageUrl] = useState<string | null>(null);

  const handleGeneratePlan = async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Generate textual plan
      const generatedPlan = await generateNutritionalPlan(profile);
      setPlan(generatedPlan);
      
      // 2. Generate visual infographic
      const imageUrl = await generatePlanImage(generatedPlan);
      setPlanImageUrl(imageUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setPlanImageUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={handleReset} style={{cursor: 'pointer'}}>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">NutriVision <span className="text-emerald-600">AI</span></span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-emerald-600 transition">How it works</a>
            <a href="#" className="hover:text-emerald-600 transition">Science</a>
            <a href="#" className="hover:text-emerald-600 transition">Blog</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        {!plan ? (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                Personalized Nutrition, <span className="text-emerald-600">Visualized.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Stop guessing. Get a scientifically-backed nutritional plan tailored to your body, goals, and lifestyle, complete with a professional infographic.
              </p>
            </div>
            
            {isLoading ? (
              <LoadingState />
            ) : (
              <ProfileForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
            )}
          </div>
        ) : (
          planImageUrl && (
            <PlanDisplay 
              plan={plan} 
              imageUrl={planImageUrl} 
              onReset={handleReset} 
            />
          )
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-center max-w-lg mx-auto">
            <p className="font-bold mb-1">Oops! Something went wrong</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight">NutriVision AI</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Empowering users through artificial intelligence to reach their fitness and health goals with clarity and precision.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400">Nutritional Science</a></li>
              <li><a href="#" className="hover:text-emerald-400">Fitness FAQ</a></li>
              <li><a href="#" className="hover:text-emerald-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400">Twitter / X</a></li>
              <li><a href="#" className="hover:text-emerald-400">Instagram</a></li>
              <li><a href="#" className="hover:text-emerald-400">Email Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          © {new Date().getFullYear()} NutriVision AI. All rights reserved. Not a substitute for professional medical advice.
        </div>
      </footer>
    </div>
  );
};

export default App;
