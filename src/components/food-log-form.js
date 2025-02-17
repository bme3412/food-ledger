'use client';

import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

export function FoodLogForm({ formData, onChange, onSubmit, onReset, loading }) {
  const [activeField, setActiveField] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mealFields = [
    {
      id: 'breakfast',
      label: 'Breakfast',
      placeholder: 'e.g., 2 eggs, wheat toast, 1 cup greek yogurt',
      description: 'Start your day with protein-rich foods',
      suggestions: [
        '2 large eggs + 2 slices whole wheat toast + 1 cup greek yogurt',
        'Oatmeal with banana, almonds, and protein powder',
        'Smoothie bowl with berries, granola, and chia seeds'
      ],
      icon: '🍳'
    },
    {
      id: 'lunch',
      label: 'Lunch',
      placeholder: 'e.g., 6oz chicken breast, 1 cup brown rice, 2 cups broccoli',
      description: 'Balance proteins and complex carbs',
      suggestions: [
        '6oz grilled chicken + 1 cup quinoa + mixed vegetables',
        'Turkey sandwich with avocado + apple + mixed greens',
        'Tuna salad with mixed greens + whole grain crackers'
      ],
      icon: '🥗'
    },
    {
      id: 'dinner',
      label: 'Dinner',
      placeholder: 'e.g., 6oz salmon, 1 cup quinoa, mixed vegetables',
      description: 'Focus on lean proteins and vegetables',
      suggestions: [
        '6oz salmon + sweet potato + asparagus',
        'Lean steak + roasted vegetables + quinoa',
        'Tofu stir-fry with brown rice + mixed vegetables'
      ],
      icon: '🍽️'
    },
    {
      id: 'snacks',
      label: 'Snacks',
      placeholder: 'e.g., 1 apple, protein bar, 1oz almonds',
      description: 'Choose nutrient-dense options',
      suggestions: [
        'Apple + 1oz almonds',
        'Protein bar + banana',
        'Greek yogurt + berries'
      ],
      icon: '🍎'
    }
  ];

  const handleFocus = (fieldId) => {
    setActiveField(fieldId);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Small delay to allow clicking suggestions
    setTimeout(() => {
      setActiveField(null);
      setShowSuggestions(false);
    }, 200);
  };

  const handleSuggestionClick = (suggestion, fieldId) => {
    onChange({
      target: {
        name: fieldId,
        value: suggestion
      }
    });
  };

  const hasContent = Object.values(formData).some(value => value.trim() !== '');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Daily Food Log</CardTitle>
            <CardDescription>Record your meals for nutritional analysis</CardDescription>
          </div>
          {hasContent && (
            <button
              onClick={onReset}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              type="button"
            >
              Clear All
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {mealFields.map(({ id, label, placeholder, description, suggestions, icon }) => (
            <div key={id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span>{icon}</span>
                  {label}
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <textarea
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={onChange}
                  onFocus={() => handleFocus(id)}
                  onBlur={handleBlur}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 
                           focus:border-blue-500 min-h-[60px] resize-y"
                  placeholder={placeholder}
                />
                {showSuggestions && activeField === id && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    <div className="p-2 text-xs text-gray-500 border-b">
                      Quick suggestions:
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full p-2 text-left text-sm hover:bg-gray-50 
                                 transition-colors cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion, id)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !hasContent}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md 
                       hover:bg-blue-700 disabled:bg-blue-300 transition-colors 
                       transform hover:scale-[1.02] active:scale-[0.98] 
                       disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" 
                            stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Analyze Nutrition'
              )}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}