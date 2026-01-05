
import React, { useState, useEffect } from 'react';

const messages = [
  "Calculating nutritional requirements...",
  "Selecting the freshest meal options...",
  "Optimizing macronutrient ratios...",
  "Generating a visual infographic...",
  "Finalizing your personalized plan...",
  "Almost there! Preparing healthy suggestions..."
];

const LoadingState: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Data</h3>
      <p className="text-slate-500 animate-pulse text-center max-w-xs">{messages[msgIndex]}</p>
    </div>
  );
};

export default LoadingState;
