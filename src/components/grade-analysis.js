// src/components/grade-analysis.js
import React from 'react';

export function GradeAnalysis({ gradeBreakdown }) {
  if (!gradeBreakdown) return null;

  const getGradeColor = (grade) => {
    // Ensure grade is a string and not undefined/null
    const gradeStr = String(grade || '');
    
    const gradeColors = {
      'A': 'text-green-600',
      'B': 'text-blue-600',
      'C': 'text-yellow-600',
      'D': 'text-orange-600',
      'F': 'text-red-600'
    };
    
    return gradeColors[gradeStr.charAt(0)] || 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Detailed Analysis</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {gradeBreakdown.headers?.map((header, index) => (
                <th
                  key={`header-${index}`}
                  className="border p-3 text-left text-sm font-semibold text-gray-700"
                >
                  {String(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {gradeBreakdown.rows?.map((row, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className="hover:bg-gray-50 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`cell-${rowIndex}-${cellIndex}`}
                    className={`border p-3 text-sm ${
                      cellIndex === 1 ? getGradeColor(cell) + ' font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Recommendations({ overall }) {
  if (!overall) return null;

  const getGradeColor = (grade) => {
    // Ensure grade is a string
    const gradeStr = String(grade || '');
    
    switch (gradeStr.charAt(0)) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recommendations</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Overall Grade:</span>
          <span className={`text-lg font-bold ${getGradeColor(overall.grade)}`}>
            {overall.grade || 'N/A'}
          </span>
        </div>
      </div>
      <ul className="space-y-4">
        {overall.recommendations?.map((rec, index) => (
          <li key={`rec-${index}`} className="flex items-start space-x-3">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
              {index + 1}
            </span>
            <span className="text-gray-700">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}