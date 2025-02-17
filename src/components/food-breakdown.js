// src/components/food-breakdown.js
import React from 'react';

export function FoodBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    return value;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Food Intake Breakdown
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {breakdown.headers.map((header, index) => (
                  <th
                    key={`header-${index}`}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {breakdown.rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} className="hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {formatValue(cell)}
                    </td>
                  ))}
                </tr>
              ))}
              {breakdown.totals && (
                <tr className="bg-gray-50 font-medium">
                  {breakdown.totals.map((total, index) => (
                    <td
                      key={`total-${index}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold"
                    >
                      {formatValue(total)}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Target Percentages */}
        {breakdown.targetPercentages && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {breakdown.targetPercentages.map((percentage, index) => (
              <div key={`target-${index}`} className="text-center">
                <div className="text-sm text-gray-600">
                  {breakdown.headers[index + 1]} Target
                </div>
                <div className="mt-1">
                  <span className={`text-lg font-semibold ${
                    percentage >= 90 ? 'text-green-600' :
                    percentage >= 70 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${
                      percentage >= 90 ? 'bg-green-600' :
                      percentage >= 70 ? 'bg-yellow-600' :
                      'bg-red-600'
                    } transition-all duration-500`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}