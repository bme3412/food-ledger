import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Changed function name to match the export
export function FullReportModal({ analysis }) {
  const [aiReport, setAiReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAIReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysis }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report');
      }

      setAiReport(data.report);
    } catch (err) {
      setError(err.message || 'Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderReportContent = () => {
    if (!aiReport) return null;

    const sections = aiReport.split('\n\n');
    const reportData = {
      grade: sections.find(s => s.includes('Overall Daily Grade'))?.split(':')[1]?.trim() || 'N/A',
      calories: sections.find(s => s.includes('Calories Table'))?.split('\n').slice(1) || [],
      macros: sections.find(s => s.includes('Macro Breakdown'))?.split('\n').slice(1) || [],
      recommendations: sections.find(s => s.includes('Recommendations:'))?.split('\n').slice(1) || [],
    };

    return (
      <div className="space-y-6">
        {/* Grade Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Overall Grade</h3>
              <span className="text-2xl font-bold text-blue-600">{reportData.grade}</span>
            </div>
          </CardContent>
        </Card>

        {/* Calories Table */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Calorie Distribution</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meal</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.calories.map((row, index) => {
                  const [meal, calories] = row.split('|').map(s => s.trim());
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{meal}</TableCell>
                      <TableCell className="text-right">{calories}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Macro Breakdown */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Macro Distribution</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nutrient</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Target %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.macros.map((row, index) => {
                  const [nutrient, amount, percentage] = row.split('|').map(s => s.trim());
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{nutrient}</TableCell>
                      <TableCell className="text-right">{amount}</TableCell>
                      <TableCell className="text-right">{percentage}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {reportData.recommendations.map((rec, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          View Detailed Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Nutritional Analysis Report
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Initial State */}
          {!aiReport && !loading && !error && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">
                Generate a detailed analysis of your nutritional data
              </p>
              <Button onClick={generateAIReport} className="bg-blue-600 hover:bg-blue-700">
                Generate Report
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Analyzing your nutritional data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="text-center">
                <Button onClick={generateAIReport} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Report Content */}
          {aiReport && !loading && renderReportContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Make sure we have both named and default exports
export default FullReportModal;