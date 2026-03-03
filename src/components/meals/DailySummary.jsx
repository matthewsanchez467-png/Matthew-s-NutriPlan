import React from 'react';
import { Flame, Beef, Wheat, Droplets, Leaf, Target, CheckCircle } from 'lucide-react';

export default function DailySummary({ meals }) {
  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein_g || 0),
    carbs: acc.carbs + (meal.carbs_g || 0),
    fat: acc.fat + (meal.fat_g || 0),
    fiber: acc.fiber + (meal.fiber_g || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  // Daily targets for an active young adult male
  const targets = {
    calories: { min: 2000, max: 2500 },
    protein: { min: 50, max: 100 },
    carbs: { min: 250, max: 350 },
    fat: { min: 65, max: 90 },
    fiber: { min: 25, max: 38 },
  };

  const checkBalance = (value, target) => {
    if (value >= target.min && value <= target.max) return 'good';
    if (value < target.min) return 'low';
    return 'high';
  };

  const macroData = [
    { label: 'Calories', value: Math.round(totals.calories), unit: 'kcal', icon: Flame, color: 'orange', target: targets.calories },
    { label: 'Protein', value: Math.round(totals.protein), unit: 'g', icon: Beef, color: 'red', target: targets.protein },
    { label: 'Carbs', value: Math.round(totals.carbs), unit: 'g', icon: Wheat, color: 'amber', target: targets.carbs },
    { label: 'Fat', value: Math.round(totals.fat), unit: 'g', icon: Droplets, color: 'blue', target: targets.fat },
    { label: 'Fiber', value: Math.round(totals.fiber), unit: 'g', icon: Leaf, color: 'green', target: targets.fiber },
  ];

  // Calculate macro percentages
  const totalMacroCalories = (totals.protein * 4) + (totals.carbs * 4) + (totals.fat * 9);
  const proteinPercent = Math.round((totals.protein * 4 / totalMacroCalories) * 100) || 0;
  const carbsPercent = Math.round((totals.carbs * 4 / totalMacroCalories) * 100) || 0;
  const fatPercent = Math.round((totals.fat * 9 / totalMacroCalories) * 100) || 0;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-emerald-400" />
        <h3 className="font-bold text-lg">Daily Nutritional Summary</h3>
      </div>

      {/* Macro Distribution Bar */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-2">Macro Distribution</p>
        <div className="h-4 rounded-full overflow-hidden flex">
          <div 
            className="bg-red-500 transition-all" 
            style={{ width: `${proteinPercent}%` }}
            title={`Protein: ${proteinPercent}%`}
          />
          <div 
            className="bg-amber-500 transition-all" 
            style={{ width: `${carbsPercent}%` }}
            title={`Carbs: ${carbsPercent}%`}
          />
          <div 
            className="bg-blue-500 transition-all" 
            style={{ width: `${fatPercent}%` }}
            title={`Fat: ${fatPercent}%`}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Protein {proteinPercent}%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-amber-500 rounded-full" />
            Carbs {carbsPercent}%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            Fat {fatPercent}%
          </span>
        </div>
      </div>

      {/* Individual Macros */}
      <div className="grid grid-cols-5 gap-3">
        {macroData.map((macro) => {
          const status = checkBalance(macro.value, macro.target);
          return (
            <div key={macro.label} className="text-center">
              <div className={`bg-${macro.color}-500/20 rounded-xl p-3 mb-2`}>
                <macro.icon className={`w-5 h-5 text-${macro.color}-400 mx-auto`} />
              </div>
              <p className="text-xl font-bold">{macro.value}</p>
              <p className="text-xs text-gray-400">{macro.unit}</p>
              <p className="text-xs font-medium mt-1">{macro.label}</p>
              {status === 'good' && (
                <CheckCircle className="w-3 h-3 text-emerald-400 mx-auto mt-1" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center">
          Target Range: 2000-2500 kcal | Protein: 50-100g | Carbs: 250-350g | Fat: 65-90g | Fiber: 25-38g
        </p>
      </div>
    </div>
  );
}