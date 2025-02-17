"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, TrendingUp, TrendingDown } from "lucide-react";

export function TargetProgress({ targets, progress }) {
  if (!targets || !progress) return null;

  const metrics = [
    {
      id: "calories",
      label: "Calories",
      target: targets.calories,
      current: progress.foodBreakdown?.totals?.[1] || 0,
      progressPercent: progress.foodBreakdown?.targetPercentages?.[0] || 0,
      unit: "kcal",
      color: "emerald",
      info: "Daily caloric target for your weight loss goal",
      allowedRange: 0.1, // 10% flexibility
    },
    {
      id: "protein",
      label: "Protein",
      target: targets.protein,
      current: progress.foodBreakdown?.totals?.[2] || 0,
      progressPercent: (progress.macroDistribution?.protein?.targetMet || 0) * 100,
      unit: "g",
      color: "rose",
      info: "Essential for muscle maintenance during weight loss",
      allowedRange: 0.05, // 5% flexibility
    },
    {
      id: "carbs",
      label: "Carbs",
      target: targets.carbs,
      current: progress.foodBreakdown?.totals?.[3] || 0,
      progressPercent: (progress.macroDistribution?.carbs?.targetMet || 0) * 100,
      unit: "g",
      color: "sky",
      info: "Primary energy source for daily activities",
      allowedRange: 0.15, // 15% flexibility
    },
    {
      id: "fats",
      label: "Fats",
      target: targets.fats,
      current: progress.foodBreakdown?.totals?.[4] || 0,
      progressPercent: (progress.macroDistribution?.fat?.targetMet || 0) * 100,
      unit: "g",
      color: "amber",
      info: "Essential for hormone function and nutrient absorption",
      allowedRange: 0.15, // 15% flexibility
    },
  ];

  const getProgressStatus = (metric) => {
    const difference = metric.current - metric.target;
    const allowedDeviation = metric.target * metric.allowedRange;

    if (Math.abs(difference) <= allowedDeviation) {
      return "optimal";
    }
    return difference > 0 ? "high" : "low";
  };

  const getStatusColors = (status) => {
    switch (status) {
      case "optimal":
        return {
          text: "text-green-700",
          bg: "bg-green-100",
          icon: null,
        };
      case "high":
        return {
          text: "text-red-700",
          bg: "bg-red-100",
          icon: <TrendingUp className="w-4 h-4" />,
        };
      case "low":
        return {
          text: "text-yellow-700",
          bg: "bg-yellow-100",
          icon: <TrendingDown className="w-4 h-4" />,
        };
      default:
        return {
          text: "text-gray-700",
          bg: "bg-gray-100",
          icon: null,
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Daily Target Progress</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Track your progress towards daily nutritional targets
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Responsive grid: 1 col on small screens, 2 cols on sm+, 4 cols on lg+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const status = getProgressStatus(metric);
            const statusColors = getStatusColors(status);

            return (
              <div key={metric.id} className="relative group rounded-md bg-white">
                {/* Header row with metric label and target */}
                <div className="flex justify-between items-baseline mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">{metric.label}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">{metric.info}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm text-gray-500">
                    Target: {metric.target}
                    {metric.unit}
                  </span>
                </div>

                {/* Current value, status, progress bar */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold">
                          {Math.round(metric.current)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {metric.unit}
                        </span>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${statusColors.bg} ${statusColors.text} flex items-center gap-1`}
                      >
                        {statusColors.icon}
                        <span>
                          {status === "optimal"
                            ? "On Target"
                            : status === "high"
                            ? "Above Target"
                            : "Below Target"}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 bg-${metric.color}-500 ${
                          metric.progressPercent > 100 ? "animate-pulse" : ""
                        }`}
                        style={{
                          width: `${Math.min(100, metric.progressPercent).toFixed(1)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer row with progress % and difference */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    Progress: {metric.progressPercent.toFixed(1)}%
                  </span>
                  <span>
                    {metric.current > metric.target ? "+" : ""}
                    {(metric.current - metric.target).toFixed(1)} {metric.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
