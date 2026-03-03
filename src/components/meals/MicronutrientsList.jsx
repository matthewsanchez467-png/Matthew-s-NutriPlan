import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MicronutrientsList({ micronutrients }) {
  if (!micronutrients || micronutrients.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Key Micronutrients</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {micronutrients.map((nutrient, idx) => (
          <div 
            key={idx} 
            className="bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-1.5 rounded-full border border-purple-100"
          >
            <span className="text-xs font-medium text-purple-700">{nutrient.name}</span>
            <span className="text-xs text-purple-500 ml-1">({nutrient.amount})</span>
          </div>
        ))}
      </div>
    </div>
  );
}