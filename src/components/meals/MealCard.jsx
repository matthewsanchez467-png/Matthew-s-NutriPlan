import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Apple, UtensilsCrossed, Cookie, Moon, ChevronDown, ChevronUp } from 'lucide-react';
import NutritionLabel from './NutritionLabel';
import MicronutrientsList from './MicronutrientsList';
import RecipeCard from './RecipeCard';

const mealIcons = {
  'Breakfast': { icon: Coffee, color: 'bg-amber-500', lightBg: 'bg-amber-50' },
  'Snack 1': { icon: Apple, color: 'bg-green-500', lightBg: 'bg-green-50' },
  'Lunch': { icon: UtensilsCrossed, color: 'bg-blue-500', lightBg: 'bg-blue-50' },
  'Snack 2': { icon: Cookie, color: 'bg-pink-500', lightBg: 'bg-pink-50' },
  'Dinner': { icon: Moon, color: 'bg-purple-500', lightBg: 'bg-purple-50' },
};

export default function MealCard({ meal, index }) {
  const [expanded, setExpanded] = useState(false);
  const config = mealIcons[meal.meal_type] || mealIcons['Breakfast'];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div 
        className="p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`${config.color} p-3 rounded-xl shadow-sm`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{meal.meal_type}</p>
              <h3 className="text-lg font-bold text-gray-800 mt-1">{meal.meal_name}</h3>
              {meal.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{meal.description}</p>
              )}
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
        </div>

        <div className="mt-4">
          <NutritionLabel meal={meal} compact={!expanded} />
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-5 pb-5 border-t border-gray-100 pt-4"
        >
          <NutritionLabel meal={meal} />
          <MicronutrientsList micronutrients={meal.micronutrients} />
          {meal.is_recipe && (
            <RecipeCard ingredients={meal.ingredients} instructions={meal.instructions} />
          )}
        </motion.div>
      )}
    </motion.div>
  );
}