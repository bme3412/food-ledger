'use client';

import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend,
  Tooltip,
  Label 
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MACRO_COLORS = {
  protein: {
    main: '#FF6B6B',
    light: '#FFE8E8',
    text: 'Supports muscle maintenance and recovery'
  },
  carbs: {
    main: '#4ECDC4',
    light: '#E8F7F6',
    text: 'Primary energy source for daily activities'
  },
  fat: {
    main: '#45B7D1',
    light: '#E8F4F8',
    text: 'Essential for hormone production and nutrient absorption'
  }
};

export function MacroChart({ macroDistribution }) {
  if (!macroDistribution) return null;

  const data = [
    {
      name: 'Protein',
      value: macroDistribution.protein.percentage,
      targetMet: macroDistribution.protein.targetMet * 100,
      color: MACRO_COLORS.protein
    },
    {
      name: 'Carbs',
      value: macroDistribution.carbs.percentage,
      targetMet: macroDistribution.carbs.targetMet * 100,
      color: MACRO_COLORS.carbs
    },
    {
      name: 'Fat',
      value: macroDistribution.fat.percentage,
      targetMet: macroDistribution.fat.targetMet * 100,
      color: MACRO_COLORS.fat
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, targetMet, color } = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <div className="font-semibold text-gray-900 mb-1">{name}</div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Distribution:</span>
              <span className="font-medium">{value.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Target Met:</span>
              <span className={`font-medium ${
                targetMet >= 90 ? 'text-green-600' :
                targetMet >= 70 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {targetMet.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            {color.text}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-1 gap-2 mt-4">
        {payload.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center p-2 rounded-lg transition-colors"
            style={{ backgroundColor: entry.color.light }}
          >
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color.main }}
            />
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <span className="font-medium text-gray-900">{entry.name}</span>
                <span className="text-sm text-gray-500">
                  {entry.value.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, entry.targetMet)}%`,
                    backgroundColor: entry.color.main
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Macro Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color.main}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
                <Label
                  content={({ viewBox: { cx, cy } }) => (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-current text-gray-600 text-sm font-medium"
                    >
                      Daily
                      <tspan x={cx} y={cy + 20}>
                        Macros
                      </tspan>
                    </text>
                  )}
                />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend payload={data} />
      </CardContent>
    </Card>
  );
}