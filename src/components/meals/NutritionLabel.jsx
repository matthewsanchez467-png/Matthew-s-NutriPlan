import React from 'react';
import { Flame, Beef, Wheat, Droplets, Leaf } from 'lucide-react';

export default function NutritionLabel({ meal, compact = false }) {
  const macros = [
    { label: 'Calories', value: meal.calories, unit: 'kcal', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Protein', value: meal.protein_g, unit: 'g', icon: Beef, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Carbs', value: meal.carbs_g, unit: 'g', icon: Wheat, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Fat', value: meal.fat_g, unit: 'g', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Fiber', value: meal.fiber_g, unit: 'g', icon: Leaf, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {macros.map((macro) => (
          <div key={macro.label} className={`flex items-center gap-1 px-2 py-1 rounded-full ${macro.bg}`}>
            <macro.icon className={`w-3 h-3 ${macro.color}`} />
            <span className="text-xs font-medium text-gray-700">{macro.value}{macro.unit}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Nutrition Facts</h4>
      <div className="grid grid-cols-5 gap-2">
        {macros.map((macro) => (
          <div key={macro.label} className={`${macro.bg} rounded-lg p-3 text-center`}>
            <macro.icon className={`w-5 h-5 ${macro.color} mx-auto mb-1`} />
            <p className="text-lg font-bold text-gray-800">{macro.value}</p>
            <p className="text-xs text-gray-500">{macro.unit}</p>
            <p className="text-xs font-medium text-gray-600 mt-1">{macro.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}