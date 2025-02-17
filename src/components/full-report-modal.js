'use client';

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

  const parseReport = (reportText) => {
    if (!reportText) return null;

    const sections = {};
    let currentSection = '';
    const lines = reportText.split('\n');

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Check if this is a section header
      if (line.startsWith('**') && line.endsWith('**')) {
        currentSection = line.replace(/\*\*/g, '').trim();
        sections[currentSection] = [];
      } else {
        // Add content to current section
        if (currentSection) {
          if (line.startsWith('* ')) {
            line = line.substring(2);
          }
          sections[currentSection].push(line);
        }
      }
    }

    return sections;
  };

  const renderReportContent = () => {
    if (!aiReport) return null;

    const sections = parseReport(aiReport);
    if (!sections) return null;

    return (
      <div className="space-y-6">
        {/* Grade Section */}
        {sections['Overall Grade'] && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Overall Grade</h3>
                <span className="text-2xl font-bold text-blue-600">
                  {sections['Overall Grade'][0]}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Food Log Review */}
        {sections['Food Log'] && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Food Log</h3>
              <div className="space-y-4">
                {sections['Food Log'].map((item, index) => (
                  <div key={index} className="text-gray-700">{item}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nutritional Breakdown */}
        {sections['Nutritional Breakdown'] && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Nutritional Breakdown</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meal</TableHead>
                    <TableHead className="text-right">Calories</TableHead>
                    <TableHead className="text-right">Protein (g)</TableHead>
                    <TableHead className="text-right">Carbs (g)</TableHead>
                    <TableHead className="text-right">Fat (g)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections['Nutritional Breakdown'].map((row, index) => {
                    const values = row.split(/\s+/);
                    if (values.length < 5) return null;
                    const isTotal = values[0].toLowerCase().includes('total');
                    
                    return (
                      <TableRow key={index} className={isTotal ? "font-bold" : ""}>
                        <TableCell>{values[0]}</TableCell>
                        <TableCell className="text-right">{values[1]}</TableCell>
                        <TableCell className="text-right">{values[2]}</TableCell>
                        <TableCell className="text-right">{values[3]}</TableCell>
                        <TableCell className="text-right">{values[4]}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {sections['Summary'] && sections['Summary'].length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Summary</h3>
              <ul className="space-y-2">
                {sections['Summary'].map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {sections['Recommendations'] && sections['Recommendations'].length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h3>
              <ul className="space-y-3">
                {sections['Recommendations'].map((rec, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
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
                Generate a detailed analysis of your food log
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
              <p className="text-gray-600">Analyzing your food log...</p>
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

export default FullReportModal;