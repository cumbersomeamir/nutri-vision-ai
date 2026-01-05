
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, isLoading }) => {
  const [profile, setProfile] = useState<UserProfile>({
    age: 30,
    gender: 'male',
    weight: 75,
    height: 175,
    activityLevel: 'moderate',
    goal: 'maintenance',
    dietaryRestrictions: []
  });

  const [restrictionInput, setRestrictionInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) || name === 'gender' || name === 'activityLevel' || name === 'goal' ? value : Number(value)
    }));
  };

  const addRestriction = () => {
    if (restrictionInput.trim() && !profile.dietaryRestrictions.includes(restrictionInput.trim())) {
      setProfile(prev => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, restrictionInput.trim()]
      }));
      setRestrictionInput('');
    }
  };

  const removeRestriction = (tag: string) => {
    setProfile(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const inputClasses = "w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-slate-400 transition-colors";

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border border-slate-100">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Your Health Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleInputChange}
              className={inputClasses}
              required
              min="1"
              max="120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleInputChange}
              className={inputClasses}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleInputChange}
              className={inputClasses}
              required
              min="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={handleInputChange}
              className={inputClasses}
              required
              min="50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Activity Level</label>
          <select
            name="activityLevel"
            value={profile.activityLevel}
            onChange={handleInputChange}
            className={inputClasses}
          >
            <option value="sedentary">Sedentary (Office job)</option>
            <option value="light">Lightly Active (1-2 days/week)</option>
            <option value="moderate">Moderately Active (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="very_active">Very Active (Athlete level)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Goal</label>
          <select
            name="goal"
            value={profile.goal}
            onChange={handleInputChange}
            className={inputClasses}
          >
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
            <option value="health_optimization">General Health Optimization</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Dietary Restrictions</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={restrictionInput}
              onChange={(e) => setRestrictionInput(e.target.value)}
              placeholder="e.g., Vegan, Nut-free..."
              className={inputClasses}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRestriction())}
            />
            <button
              type="button"
              onClick={addRestriction}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors border border-slate-200"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.dietaryRestrictions.map(r => (
              <span key={r} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-emerald-100">
                {r}
                <button 
                  type="button" 
                  onClick={() => removeRestriction(r)} 
                  className="hover:text-emerald-900 leading-none text-lg"
                  aria-label={`Remove ${r}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] ${
            isLoading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Crafting Your Plan...
            </span>
          ) : (
            'Generate My Nutritional Plan'
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
