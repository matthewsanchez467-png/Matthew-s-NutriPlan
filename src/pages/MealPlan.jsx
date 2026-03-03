import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Utensils, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MealCard from '@/components/meals/MealCard';
import DailySummary from '@/components/meals/DailySummary';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const MEAL_DATA = {
  Monday: [
    {
      meal_type: 'Breakfast',
      meal_name: 'Greek Yogurt Parfait with Berries & Granola',
      description: 'Creamy protein-rich Greek yogurt layered with fresh mixed berries and crunchy homemade granola',
      calories: 420,
      protein_g: 22,
      carbs_g: 58,
      fat_g: 12,
      fiber_g: 6,
      micronutrients: [
        { name: 'Calcium', amount: '250mg (25% DV)' },
        { name: 'Vitamin C', amount: '15mg (17% DV)' },
        { name: 'Probiotics', amount: 'Live cultures' },
        { name: 'Potassium', amount: '380mg (8% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '1 cup plain Greek yogurt (2% fat)',
        '1/2 cup mixed berries (strawberries, blueberries, raspberries)',
        '1/4 cup low-sugar granola',
        '1 tbsp honey',
        '1 tbsp sliced almonds'
      ],
      instructions: [
        'In a glass or bowl, add half of the Greek yogurt as the base layer.',
        'Add a layer of mixed berries on top of the yogurt.',
        'Sprinkle half of the granola over the berries.',
        'Repeat layers with remaining yogurt, berries, and granola.',
        'Drizzle honey on top and garnish with sliced almonds.',
        'Serve immediately for best texture.'
      ]
    },
    {
      meal_type: 'Snack 1',
      meal_name: 'Apple Slices with Almond Butter',
      description: 'Crisp apple slices paired with creamy natural almond butter for sustained energy',
      calories: 210,
      protein_g: 5,
      carbs_g: 28,
      fat_g: 10,
      fiber_g: 5,
      micronutrients: [
        { name: 'Vitamin E', amount: '4mg (27% DV)' },
        { name: 'Magnesium', amount: '45mg (11% DV)' },
        { name: 'Vitamin C', amount: '8mg (9% DV)' }
      ],
      is_recipe: false,
      ingredients: ['1 medium apple', '2 tbsp natural almond butter'],
      instructions: []
    },
    {
      meal_type: 'Lunch',
      meal_name: 'Grilled Chicken Quinoa Bowl',
      description: 'Herb-marinated grilled chicken breast over fluffy quinoa with roasted vegetables',
      calories: 550,
      protein_g: 42,
      carbs_g: 52,
      fat_g: 18,
      fiber_g: 8,
      micronutrients: [
        { name: 'Iron', amount: '4.5mg (25% DV)' },
        { name: 'Vitamin B6', amount: '0.8mg (47% DV)' },
        { name: 'Selenium', amount: '35mcg (64% DV)' },
        { name: 'Zinc', amount: '3mg (27% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '5 oz chicken breast',
        '1 cup cooked quinoa',
        '1/2 cup roasted bell peppers',
        '1/2 cup roasted zucchini',
        '1/4 cup chickpeas',
        '2 tbsp olive oil',
        '1 tbsp lemon juice',
        'Fresh herbs (basil, oregano)',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Season chicken breast with salt, pepper, and dried herbs.',
        'Grill chicken for 6-7 minutes per side until internal temp reaches 165°F.',
        'Cook quinoa according to package directions.',
        'Toss bell peppers and zucchini with 1 tbsp olive oil, roast at 400°F for 20 minutes.',
        'Let chicken rest 5 minutes, then slice.',
        'Assemble bowl: quinoa base, topped with vegetables, chickpeas, and sliced chicken.',
        'Drizzle with remaining olive oil and lemon juice. Season to taste.'
      ]
    },
    {
      meal_type: 'Snack 2',
      meal_name: 'Hummus with Veggie Sticks',
      description: 'Smooth chickpea hummus with colorful fresh vegetable crudités',
      calories: 180,
      protein_g: 6,
      carbs_g: 22,
      fat_g: 8,
      fiber_g: 6,
      micronutrients: [
        { name: 'Vitamin A', amount: '450mcg (50% DV)' },
        { name: 'Vitamin K', amount: '25mcg (21% DV)' },
        { name: 'Folate', amount: '80mcg (20% DV)' }
      ],
      is_recipe: false,
      ingredients: ['1/4 cup hummus', '1 cup mixed veggie sticks (carrots, celery, cucumber, bell pepper)'],
      instructions: []
    },
    {
      meal_type: 'Dinner',
      meal_name: 'Baked Salmon with Sweet Potato & Asparagus',
      description: 'Omega-3 rich Atlantic salmon with herb-roasted sweet potato and tender asparagus',
      calories: 580,
      protein_g: 38,
      carbs_g: 42,
      fat_g: 28,
      fiber_g: 7,
      micronutrients: [
        { name: 'Omega-3 (EPA+DHA)', amount: '2.2g' },
        { name: 'Vitamin D', amount: '15mcg (75% DV)' },
        { name: 'Vitamin A', amount: '960mcg (107% DV)' },
        { name: 'Vitamin B12', amount: '4.8mcg (200% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '6 oz Atlantic salmon fillet',
        '1 medium sweet potato, cubed',
        '1 cup asparagus spears',
        '2 tbsp olive oil',
        '2 cloves garlic, minced',
        '1 lemon, sliced',
        'Fresh dill',
        'Salt and pepper'
      ],
      instructions: [
        'Preheat oven to 400°F (200°C).',
        'Toss sweet potato cubes with 1 tbsp olive oil, salt, and pepper. Spread on baking sheet.',
        'Roast sweet potatoes for 15 minutes.',
        'Season salmon with salt, pepper, and place lemon slices on top.',
        'Add asparagus to the baking sheet, drizzle with remaining oil and garlic.',
        'Add salmon to the pan. Bake everything together for 12-15 minutes.',
        'Salmon is done when it flakes easily and reaches 145°F internal temp.',
        'Garnish with fresh dill and serve immediately.'
      ]
    }
  ],
  Tuesday: [
    {
      meal_type: 'Breakfast',
      meal_name: 'Veggie Egg White Omelet with Whole Wheat Toast',
      description: 'Fluffy egg white omelet loaded with spinach, tomatoes, and feta cheese',
      calories: 380,
      protein_g: 28,
      carbs_g: 35,
      fat_g: 14,
      fiber_g: 5,
      micronutrients: [
        { name: 'Vitamin K', amount: '145mcg (121% DV)' },
        { name: 'Vitamin A', amount: '280mcg (31% DV)' },
        { name: 'Selenium', amount: '28mcg (51% DV)' },
        { name: 'Choline', amount: '120mg (22% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '4 egg whites',
        '1 whole egg',
        '1 cup fresh spinach',
        '1/4 cup diced tomatoes',
        '2 tbsp crumbled feta cheese',
        '1 slice whole wheat bread',
        '1 tsp olive oil',
        'Salt and pepper'
      ],
      instructions: [
        'Whisk egg whites and whole egg together with a pinch of salt.',
        'Heat olive oil in a non-stick pan over medium heat.',
        'Add spinach and tomatoes, sauté for 1-2 minutes until spinach wilts.',
        'Pour egg mixture over vegetables, let set for 1 minute.',
        'Sprinkle feta cheese on one half.',
        'Fold omelet in half, cook 1-2 more minutes until fully set.',
        'Toast bread and serve alongside omelet.'
      ]
    },
    {
      meal_type: 'Snack 1',
      meal_name: 'Trail Mix (Nuts, Seeds & Dried Fruit)',
      description: 'Energizing mix of almonds, walnuts, pumpkin seeds, and unsweetened dried cranberries',
      calories: 200,
      protein_g: 6,
      carbs_g: 18,
      fat_g: 14,
      fiber_g: 3,
      micronutrients: [
        { name: 'Vitamin E', amount: '5mg (33% DV)' },
        { name: 'Magnesium', amount: '55mg (13% DV)' },
        { name: 'Zinc', amount: '1.5mg (14% DV)' }
      ],
      is_recipe: false,
      ingredients: ['1/4 cup mixed nuts (almonds, walnuts)', '1 tbsp pumpkin seeds', '2 tbsp unsweetened dried cranberries'],
      instructions: []
    },
    {
      meal_type: 'Lunch',
      meal_name: 'Turkey & Avocado Whole Grain Wrap',
      description: 'Lean turkey breast with creamy avocado, mixed greens, and honey mustard in a whole grain wrap',
      calories: 520,
      protein_g: 35,
      carbs_g: 48,
      fat_g: 22,
      fiber_g: 9,
      micronutrients: [
        { name: 'Vitamin B3 (Niacin)', amount: '12mg (75% DV)' },
        { name: 'Potassium', amount: '680mg (14% DV)' },
        { name: 'Folate', amount: '90mcg (23% DV)' },
        { name: 'Vitamin C', amount: '12mg (13% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '1 large whole grain tortilla wrap',
        '4 oz sliced turkey breast',
        '1/2 ripe avocado, sliced',
        '1 cup mixed greens',
        '2 slices tomato',
        '1 tbsp honey mustard',
        '1/4 cup shredded carrots'
      ],
      instructions: [
        'Lay the whole grain wrap flat on a clean surface.',
        'Spread honey mustard evenly across the center of the wrap.',
        'Layer turkey slices in the center.',
        'Add avocado slices, mixed greens, tomato, and shredded carrots.',
        'Fold the bottom of the wrap up over the filling.',
        'Fold in both sides, then roll tightly from bottom to top.',
        'Cut diagonally and serve immediately.'
      ]
    },
    {
      meal_type: 'Snack 2',
      meal_name: 'Cottage Cheese with Pineapple',
      description: 'Low-fat cottage cheese topped with fresh pineapple chunks',
      calories: 160,
      protein_g: 18,
      carbs_g: 16,
      fat_g: 2,
      fiber_g: 1,
      micronutrients: [
        { name: 'Calcium', amount: '180mg (14% DV)' },
        { name: 'Vitamin C', amount: '28mg (31% DV)' },
        { name: 'Manganese', amount: '0.9mg (39% DV)' }
      ],
      is_recipe: false,
      ingredients: ['3/4 cup low-fat cottage cheese', '1/2 cup fresh pineapple chunks'],
      instructions: []
    },
    {
      meal_type: 'Dinner',
      meal_name: 'Lean Beef Stir-Fry with Brown Rice',
      description: 'Tender strips of lean beef with colorful vegetables in a savory ginger-garlic sauce',
      calories: 560,
      protein_g: 38,
      carbs_g: 58,
      fat_g: 18,
      fiber_g: 6,
      micronutrients: [
        { name: 'Iron', amount: '4.2mg (23% DV)' },
        { name: 'Vitamin B12', amount: '2.8mcg (117% DV)' },
        { name: 'Zinc', amount: '6mg (55% DV)' },
        { name: 'Vitamin C', amount: '45mg (50% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '5 oz lean beef sirloin, sliced thin',
        '1 cup cooked brown rice',
        '1 cup broccoli florets',
        '1/2 cup sliced bell peppers',
        '1/4 cup snap peas',
        '2 tbsp low-sodium soy sauce',
        '1 tbsp sesame oil',
        '1 clove garlic, minced',
        '1 tsp fresh ginger, grated'
      ],
      instructions: [
        'Cook brown rice according to package directions.',
        'Heat sesame oil in a wok or large skillet over high heat.',
        'Add beef strips, stir-fry 2-3 minutes until browned. Remove and set aside.',
        'Add garlic and ginger, stir-fry 30 seconds until fragrant.',
        'Add broccoli, bell peppers, and snap peas. Stir-fry 4-5 minutes.',
        'Return beef to the wok, add soy sauce.',
        'Toss everything together for 1 minute.',
        'Serve immediately over brown rice.'
      ]
    }
  ],
  Wednesday: [
    {
      meal_type: 'Breakfast',
      meal_name: 'Overnight Oats with Banana & Chia Seeds',
      description: 'Creamy overnight oats with fresh banana slices, chia seeds, and a drizzle of maple syrup',
      calories: 410,
      protein_g: 14,
      carbs_g: 68,
      fat_g: 10,
      fiber_g: 10,
      micronutrients: [
        { name: 'Manganese', amount: '2.2mg (96% DV)' },
        { name: 'Phosphorus', amount: '280mg (22% DV)' },
        { name: 'Potassium', amount: '520mg (11% DV)' },
        { name: 'Omega-3 (ALA)', amount: '2.5g' }
      ],
      is_recipe: true,
      ingredients: [
        '1/2 cup rolled oats',
        '1/2 cup milk (dairy or almond)',
        '1/4 cup Greek yogurt',
        '1 tbsp chia seeds',
        '1 medium banana, sliced',
        '1 tbsp maple syrup',
        'Pinch of cinnamon'
      ],
      instructions: [
        'In a jar or container, combine oats, milk, yogurt, and chia seeds.',
        'Add cinnamon and stir well to combine.',
        'Cover and refrigerate overnight (at least 6 hours).',
        'In the morning, stir the oats and add more milk if desired.',
        'Top with sliced banana and drizzle with maple syrup.',
        'Enjoy cold or microwave for 1-2 minutes if you prefer warm oats.'
      ]
    },
    {
      meal_type: 'Snack 1',
      meal_name: 'String Cheese & Whole Grain Crackers',
      description: 'Part-skim mozzarella string cheese with fiber-rich whole grain crackers',
      calories: 180,
      protein_g: 10,
      carbs_g: 18,
      fat_g: 8,
      fiber_g: 3,
      micronutrients: [
        { name: 'Calcium', amount: '220mg (17% DV)' },
        { name: 'Phosphorus', amount: '180mg (14% DV)' },
        { name: 'Vitamin B12', amount: '0.4mcg (17% DV)' }
      ],
      is_recipe: false,
      ingredients: ['1 part-skim mozzarella string cheese', '8 whole grain crackers'],
      instructions: []
    },
    {
      meal_type: 'Lunch',
      meal_name: 'Mediterranean Chickpea Salad',
      description: 'Hearty chickpea salad with cucumber, tomatoes, olives, and tangy feta dressing',
      calories: 480,
      protein_g: 18,
      carbs_g: 52,
      fat_g: 24,
      fiber_g: 12,
      micronutrients: [
        { name: 'Folate', amount: '180mcg (45% DV)' },
        { name: 'Iron', amount: '4mg (22% DV)' },
        { name: 'Vitamin K', amount: '35mcg (29% DV)' },
        { name: 'Copper', amount: '0.4mg (44% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '1.5 cups canned chickpeas, drained and rinsed',
        '1 cup cucumber, diced',
        '1 cup cherry tomatoes, halved',
        '1/4 cup kalamata olives, sliced',
        '1/4 cup red onion, diced',
        '2 oz feta cheese, crumbled',
        '3 tbsp olive oil',
        '2 tbsp red wine vinegar',
        '1 tsp dried oregano',
        'Fresh parsley'
      ],
      instructions: [
        'In a large bowl, combine chickpeas, cucumber, tomatoes, olives, and red onion.',
        'In a small bowl, whisk together olive oil, red wine vinegar, and oregano.',
        'Pour dressing over the salad and toss to combine.',
        'Add crumbled feta cheese on top.',
        'Garnish with fresh parsley.',
        'Can be served immediately or chilled for enhanced flavor.'
      ]
    },
    {
      meal_type: 'Snack 2',
      meal_name: 'Edamame with Sea Salt',
      description: 'Steamed young soybeans lightly seasoned with sea salt',
      calories: 190,
      protein_g: 17,
      carbs_g: 15,
      fat_g: 8,
      fiber_g: 8,
      micronutrients: [
        { name: 'Vitamin K', amount: '52mcg (43% DV)' },
        { name: 'Folate', amount: '311mcg (78% DV)' },
        { name: 'Manganese', amount: '1.6mg (70% DV)' }
      ],
      is_recipe: false,
      ingredients: ['1 cup edamame in pods', 'Pinch of sea salt'],
      instructions: []
    },
    {
      meal_type: 'Dinner',
      meal_name: 'Herb-Crusted Chicken Breast with Roasted Vegetables',
      description: 'Juicy chicken breast with a crispy herb crust served with colorful roasted root vegetables',
      calories: 520,
      protein_g: 45,
      carbs_g: 35,
      fat_g: 22,
      fiber_g: 7,
      micronutrients: [
        { name: 'Vitamin B6', amount: '1.2mg (71% DV)' },
        { name: 'Niacin', amount: '15mg (94% DV)' },
        { name: 'Selenium', amount: '32mcg (58% DV)' },
        { name: 'Vitamin A', amount: '380mcg (42% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '6 oz boneless, skinless chicken breast',
        '2 tbsp whole wheat breadcrumbs',
        '1 tbsp fresh herbs (rosemary, thyme, parsley)',
        '2 tbsp olive oil',
        '1 cup mixed root vegetables (carrots, parsnips, turnips)',
        '1/2 cup Brussels sprouts, halved',
        '2 cloves garlic',
        'Salt and pepper'
      ],
      instructions: [
        'Preheat oven to 425°F (220°C).',
        'Mix breadcrumbs with chopped fresh herbs, salt, and pepper.',
        'Brush chicken with 1 tbsp olive oil, then coat with herb mixture.',
        'Cut root vegetables into 1-inch pieces.',
        'Toss vegetables and Brussels sprouts with remaining olive oil and garlic.',
        'Spread vegetables on a baking sheet, place chicken on top.',
        'Roast for 25-30 minutes until chicken reaches 165°F and vegetables are tender.',
        'Let chicken rest 5 minutes before slicing. Serve with vegetables.'
      ]
    }
  ],
  Thursday: [
    {
      meal_type: 'Breakfast',
      meal_name: 'Whole Grain Avocado Toast with Poached Eggs',
      description: 'Creamy smashed avocado on hearty whole grain bread topped with perfectly poached eggs',
      calories: 450,
      protein_g: 20,
      carbs_g: 38,
      fat_g: 26,
      fiber_g: 10,
      micronutrients: [
        { name: 'Vitamin E', amount: '4mg (27% DV)' },
        { name: 'Potassium', amount: '680mg (14% DV)' },
        { name: 'Choline', amount: '180mg (33% DV)' },
        { name: 'Folate', amount: '120mcg (30% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '2 slices whole grain bread',
        '1 ripe avocado',
        '2 large eggs',
        '1 tbsp white vinegar',
        'Red pepper flakes',
        'Salt and pepper',
        'Fresh chives'
      ],
      instructions: [
        'Toast bread until golden and crispy.',
        'Mash avocado with salt, pepper, and a squeeze of lemon juice.',
        'Bring a pot of water to a gentle simmer, add vinegar.',
        'Create a swirl in the water, crack egg into the center.',
        'Poach eggs for 3-4 minutes for runny yolks.',
        'Spread mashed avocado on toast.',
        'Top each toast with a poached egg.',
        'Season with salt, pepper, red pepper flakes, and fresh chives.'
      ]
    },
    {
      meal_type: 'Snack 1',
      meal_name: 'Greek Yogurt with Honey & Walnuts',
      description: 'Thick Greek yogurt drizzled with raw honey and crunchy walnuts',
      calories: 220,
      protein_g: 15,
      carbs_g: 22,
      fat_g: 10,
      fiber_g: 1,
      micronutrients: [
        { name: 'Calcium', amount: '200mg (15% DV)' },
        { name: 'Omega-3 (ALA)', amount: '1.3g' },
        { name: 'Probiotics', amount: 'Live cultures' }
      ],
      is_recipe: false,
      ingredients: ['3/4 cup plain Greek yogurt', '1 tbsp raw honey', '2 tbsp walnut pieces'],
      instructions: []
    },
    {
      meal_type: 'Lunch',
      meal_name: 'Asian-Style Tuna Poke Bowl',
      description: 'Fresh ahi tuna cubes over sushi rice with edamame, cucumber, and sesame ginger dressing',
      calories: 520,
      protein_g: 36,
      carbs_g: 55,
      fat_g: 16,
      fiber_g: 5,
      micronutrients: [
        { name: 'Selenium', amount: '92mcg (167% DV)' },
        { name: 'Vitamin B12', amount: '9mcg (375% DV)' },
        { name: 'Niacin', amount: '18mg (113% DV)' },
        { name: 'Omega-3 (DHA)', amount: '0.8g' }
      ],
      is_recipe: true,
      ingredients: [
        '5 oz sushi-grade ahi tuna, cubed',
        '1 cup cooked sushi rice',
        '1/2 cup shelled edamame',
        '1/2 cup cucumber, sliced',
        '1/4 cup carrots, shredded',
        '1 tbsp low-sodium soy sauce',
        '1 tsp sesame oil',
        '1 tsp rice vinegar',
        '1/2 tsp fresh ginger, grated',
        'Sesame seeds',
        'Sliced green onion'
      ],
      instructions: [
        'Cook sushi rice according to package directions, let cool slightly.',
        'In a small bowl, whisk soy sauce, sesame oil, rice vinegar, and ginger for dressing.',
        'Toss tuna cubes with half of the dressing.',
        'Place rice in a bowl as the base.',
        'Arrange tuna, edamame, cucumber, and carrots on top of rice.',
        'Drizzle remaining dressing over the bowl.',
        'Garnish with sesame seeds and sliced green onion.'
      ]
    },
    {
      meal_type: 'Snack 2',
      meal_name: 'Celery with Peanut Butter & Raisins',
      description: 'Classic "ants on a log" - celery sticks filled with peanut butter and topped with raisins',
      calories: 200,
      protein_g: 6,
      carbs_g: 24,
      fat_g: 10,
      fiber_g: 3,
      micronutrients: [
        { name: 'Vitamin K', amount: '18mcg (15% DV)' },
        { name: 'Niacin', amount: '2mg (13% DV)' },
        { name: 'Iron', amount: '0.8mg (4% DV)' }
      ],
      is_recipe: false,
      ingredients: ['3 large celery stalks', '2 tbsp natural peanut butter', '2 tbsp raisins'],
      instructions: []
    },
    {
      meal_type: 'Dinner',
      meal_name: 'Grilled Shrimp Tacos with Mango Salsa',
      description: 'Juicy grilled shrimp in corn tortillas topped with fresh mango salsa and creamy avocado',
      calories: 490,
      protein_g: 32,
      carbs_g: 52,
      fat_g: 18,
      fiber_g: 8,
      micronutrients: [
        { name: 'Vitamin A', amount: '120mcg (13% DV)' },
        { name: 'Vitamin C', amount: '65mg (72% DV)' },
        { name: 'Selenium', amount: '42mcg (76% DV)' },
        { name: 'Copper', amount: '0.3mg (33% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '6 oz large shrimp, peeled and deveined',
        '3 small corn tortillas',
        '1/2 mango, diced',
        '2 tbsp red onion, finely diced',
        '1 tbsp cilantro, chopped',
        '1 tbsp lime juice',
        '1/4 avocado, sliced',
        '1/4 cup shredded cabbage',
        '1 tsp olive oil',
        'Chili powder, cumin, salt'
      ],
      instructions: [
        'Season shrimp with chili powder, cumin, and salt.',
        'Make mango salsa: combine mango, red onion, cilantro, and lime juice.',
        'Heat olive oil in a grill pan over medium-high heat.',
        'Grill shrimp 2-3 minutes per side until pink and opaque.',
        'Warm corn tortillas in a dry pan.',
        'Assemble tacos: tortilla, cabbage, shrimp, mango salsa, and avocado.',
        'Squeeze additional lime juice on top and serve.'
      ]
    }
  ],
  Friday: [
    {
      meal_type: 'Breakfast',
      meal_name: 'Spinach & Mushroom Breakfast Burrito',
      description: 'Scrambled eggs with sautéed spinach and mushrooms wrapped in a whole wheat tortilla',
      calories: 420,
      protein_g: 24,
      carbs_g: 38,
      fat_g: 20,
      fiber_g: 6,
      micronutrients: [
        { name: 'Vitamin D', amount: '2mcg (10% DV)' },
        { name: 'Riboflavin', amount: '0.6mg (46% DV)' },
        { name: 'Selenium', amount: '28mcg (51% DV)' },
        { name: 'Vitamin K', amount: '120mcg (100% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '2 large eggs',
        '1 large whole wheat tortilla',
        '1 cup fresh spinach',
        '1/2 cup mushrooms, sliced',
        '2 tbsp shredded cheddar cheese',
        '1 tsp olive oil',
        '2 tbsp salsa',
        'Salt and pepper'
      ],
      instructions: [
        'Heat olive oil in a skillet over medium heat.',
        'Sauté mushrooms for 3-4 minutes until golden.',
        'Add spinach and cook until wilted, about 1 minute.',
        'Push vegetables to the side, scramble eggs in the same pan.',
        'Season with salt and pepper.',
        'Warm tortilla in a dry pan or microwave.',
        'Place eggs and vegetables in the center of tortilla.',
        'Top with cheese and salsa, fold into a burrito.'
      ]
    },
    {
      meal_type: 'Snack 1',
      meal_name: 'Mixed Berry Smoothie',
      description: 'Refreshing smoothie with mixed berries, banana, and protein-rich Greek yogurt',
      calories: 230,
      protein_g: 12,
      carbs_g: 42,
      fat_g: 3,
      fiber_g: 5,
      micronutrients: [
        { name: 'Vitamin C', amount: '35mg (39% DV)' },
        { name: 'Manganese', amount: '0.8mg (35% DV)' },
        { name: 'Antioxidants', amount: 'High (anthocyanins)' }
      ],
      is_recipe: true,
      ingredients: [
        '1/2 cup mixed berries (frozen)',
        '1/2 banana',
        '1/2 cup plain Greek yogurt',
        '1/2 cup unsweetened almond milk',
        '1 tsp honey (optional)'
      ],
      instructions: [
        'Add all ingredients to a blender.',
        'Blend on high for 60-90 seconds until smooth.',
        'Add more almond milk if needed for desired consistency.',
        'Pour into a glass and enjoy immediately.'
      ]
    },
    {
      meal_type: 'Lunch',
      meal_name: 'Lentil Soup with Crusty Whole Grain Bread',
      description: 'Hearty vegetable lentil soup packed with fiber and plant-based protein',
      calories: 480,
      protein_g: 22,
      carbs_g: 72,
      fat_g: 12,
      fiber_g: 16,
      micronutrients: [
        { name: 'Iron', amount: '6mg (33% DV)' },
        { name: 'Folate', amount: '358mcg (90% DV)' },
        { name: 'Potassium', amount: '730mg (16% DV)' },
        { name: 'Thiamin', amount: '0.5mg (42% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '1 cup cooked green lentils',
        '1/2 cup diced carrots',
        '1/2 cup diced celery',
        '1/2 cup diced onion',
        '2 cloves garlic, minced',
        '2 cups low-sodium vegetable broth',
        '1 cup diced tomatoes',
        '1 tbsp olive oil',
        '1 tsp cumin',
        '1 slice crusty whole grain bread',
        'Fresh parsley'
      ],
      instructions: [
        'Heat olive oil in a large pot over medium heat.',
        'Sauté onion, carrots, and celery for 5 minutes until softened.',
        'Add garlic and cumin, cook 1 minute until fragrant.',
        'Add lentils, diced tomatoes, and vegetable broth.',
        'Bring to a boil, then reduce heat and simmer 20-25 minutes.',
        'Season with salt and pepper to taste.',
        'Ladle into bowl, garnish with fresh parsley.',
        'Serve with crusty whole grain bread on the side.'
      ]
    },
    {
      meal_type: 'Snack 2',
      meal_name: 'Rice Cakes with Almond Butter & Banana',
      description: 'Light rice cakes topped with creamy almond butter and fresh banana slices',
      calories: 210,
      protein_g: 5,
      carbs_g: 32,
      fat_g: 8,
      fiber_g: 3,
      micronutrients: [
        { name: 'Vitamin E', amount: '3mg (20% DV)' },
        { name: 'Potassium', amount: '320mg (7% DV)' },
        { name: 'Vitamin B6', amount: '0.3mg (18% DV)' }
      ],
      is_recipe: false,
      ingredients: ['2 plain rice cakes', '1.5 tbsp almond butter', '1/2 medium banana, sliced'],
      instructions: []
    },
    {
      meal_type: 'Dinner',
      meal_name: 'Baked Cod with Quinoa & Mediterranean Vegetables',
      description: 'Flaky white cod baked with herbs, served over quinoa with roasted Mediterranean vegetables',
      calories: 510,
      protein_g: 40,
      carbs_g: 48,
      fat_g: 18,
      fiber_g: 8,
      micronutrients: [
        { name: 'Vitamin B12', amount: '1.6mcg (67% DV)' },
        { name: 'Phosphorus', amount: '420mg (34% DV)' },
        { name: 'Iodine', amount: '110mcg (73% DV)' },
        { name: 'Selenium', amount: '48mcg (87% DV)' }
      ],
      is_recipe: true,
      ingredients: [
        '6 oz cod fillet',
        '1 cup cooked quinoa',
        '1/2 cup zucchini, sliced',
        '1/2 cup cherry tomatoes',
        '1/4 cup red onion, sliced',
        '2 tbsp olive oil',
        '2 tbsp lemon juice',
        '2 cloves garlic, minced',
        'Fresh oregano and basil',
        'Salt and pepper'
      ],
      instructions: [
        'Preheat oven to 400°F (200°C).',
        'Place cod in a baking dish, season with salt, pepper, and half the lemon juice.',
        'Top cod with minced garlic and fresh herbs.',
        'Toss zucchini, tomatoes, and onion with olive oil and spread around the cod.',
        'Bake for 15-18 minutes until cod flakes easily with a fork.',
        'Meanwhile, warm quinoa and season lightly.',
        'Plate quinoa, top with roasted vegetables and cod.',
        'Drizzle with remaining lemon juice and fresh herbs.'
      ]
    }
  ]
};

export default function MealPlan() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isGenerating, setIsGenerating] = useState(false);

  const dayMeals = MEAL_DATA[selectedDay] || [];

  const mealOrder = ['Breakfast', 'Snack 1', 'Lunch', 'Snack 2', 'Dinner'];
  const sortedMeals = [...dayMeals].sort((a, b) => 
    mealOrder.indexOf(a.meal_type) - mealOrder.indexOf(b.meal_type)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 rounded-xl shadow-lg">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Matthew's Meal Plan</h1>
                <p className="text-sm text-gray-500">5-Day Balanced Nutrition</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Healthy Week</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-6 text-white shadow-xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Hey Matthew! 👋</h2>
              <p className="text-emerald-100 max-w-lg">
                Your personalized 5-day meal plan is ready. Each day includes breakfast, lunch, dinner, and 2 snacks — 
                all balanced for optimal nutrition with detailed macro and micronutrient information.
              </p>
            </div>
            <Sparkles className="w-12 h-12 text-emerald-200 opacity-50" />
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="bg-white/20 px-3 py-1.5 rounded-full">
              <span className="font-semibold">25 Meals</span> this week
            </div>
            <div className="bg-white/20 px-3 py-1.5 rounded-full">
              <span className="font-semibold">~2,000-2,100</span> kcal/day
            </div>
            <div className="bg-white/20 px-3 py-1.5 rounded-full">
              <span className="font-semibold">Balanced</span> macros
            </div>
          </div>
        </motion.div>

        {/* Day Tabs */}
        <div className="mb-6">
          <Tabs value={selectedDay} onValueChange={setSelectedDay}>
            <TabsList className="bg-white shadow-sm border border-gray-100 p-1 rounded-xl w-full grid grid-cols-5">
              {DAYS.map((day) => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{day}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Daily Summary */}
        <div className="mb-6">
          <DailySummary meals={sortedMeals} />
        </div>

        {/* Meals Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-500" />
            {selectedDay}'s Meals
          </h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {sortedMeals.map((meal, index) => (
                <MealCard key={`${meal.meal_type}-${index}`} meal={meal} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">📊 Nutritional Guidelines</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-700">Daily Targets:</p>
              <p>• Calories: 2,000-2,500 kcal</p>
              <p>• Protein: 50-100g (15-25%)</p>
              <p>• Carbs: 250-350g (45-65%)</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Fat & Fiber:</p>
              <p>• Total Fat: 65-90g (20-35%)</p>
              <p>• Fiber: 25-38g daily</p>
              <p>• Saturated Fat: &lt;20g</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Key Principles:</p>
              <p>• Whole foods focus</p>
              <p>• Minimal processed foods</p>
              <p>• Balanced macro ratios</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}