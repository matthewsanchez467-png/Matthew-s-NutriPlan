import React, { useState } from 'react';
import { ChefHat, List, ChevronDown, ChevronUp, Clock, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecipeCard({ ingredients, instructions }) {
  const [expanded, setExpanded] = useState(false);

  if (!ingredients || !instructions || ingredients.length === 0) return null;

  return (
    <div className="mt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
      >
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5" />
          <span className="font-semibold">View Full Recipe</span>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4">
              {/* Ingredients */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <List className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-semibold text-gray-800">Ingredients</h4>
                </div>
                <ul className="space-y-2">
                  {ingredients.map((ingredient, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <ChefHat className="w-5 h-5 text-teal-500" />
                  <h4 className="font-semibold text-gray-800">Step-by-Step Instructions</h4>
                </div>
                <ol className="space-y-3">
                  {instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}