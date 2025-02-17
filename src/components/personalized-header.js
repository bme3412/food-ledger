import React from 'react';
import { Badge } from '@/components/ui/badge';

const PersonalizedProgress = ({
  startingWeight = 225,  // The weight when you started your journey
  currentWeight = 220,   // Your current weight
  targetWeight = 185     // Your ultimate goal weight
}) => {
  // Determine greeting and tip based on current time
  const getTimeContent = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: "Good morning", tip: "Plan your breakfast 🌅" };
    if (hour < 17) return { greeting: "Good afternoon", tip: "Time for lunch 🍱" };
    return { greeting: "Good evening", tip: "Evening meal prep 🌙" };
  };

  const { greeting, tip } = getTimeContent();

  // Format the current date nicely
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Calculate total weight to lose and how much has been lost so far
  const totalLbsToLose = startingWeight - targetWeight;
  const lbsLostSoFar = startingWeight - currentWeight;

  // Ensure progress is never below 0% or above 100%
  const progressPercent =
    lbsLostSoFar > 0
      ? Math.min((lbsLostSoFar / totalLbsToLose) * 100, 100)
      : 0;

  // How many pounds are left to reach the goal
  const lbsRemaining = currentWeight - targetWeight;

  return (
    <div className="mb-8 w-full mx-auto max-w-lg px-4">
      <div className="text-center space-y-4">
        {/* Date and greeting */}
        <div>
          <p className="text-gray-500">{date}</p>
          <h2 className="text-xl font-medium text-gray-800">{greeting}</h2>
          <p className="text-blue-600 text-sm">{tip}</p>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          Nutrition Progress
        </h1>

        {/* Progress section */}
        <div className="space-y-4">
          {/* Badges for starting, current, and target weights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 justify-items-center">
            <Badge variant="secondary">Starting: {startingWeight} lb</Badge>
            <Badge variant="secondary">Current: {currentWeight} lb</Badge>
            <Badge variant="secondary">Target: {targetWeight} lb</Badge>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progressPercent.toFixed(1)}%` }}
            />
          </div>

          {/* Pounds remaining */}
          <p className="text-green-700 text-sm font-medium">
            {lbsRemaining > 0
              ? `${lbsRemaining} lb to goal 💪`
              : "You've reached your target weight! 🎉"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedProgress;
