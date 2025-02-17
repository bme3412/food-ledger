import React, { useState } from "react";
import { FoodLogForm } from "./food-log-form";
import { TargetProgress } from "./target-progress";
import { MacroChart } from "./macro-chart";
import { FoodBreakdown } from "./food-breakdown";
import { GradeAnalysis, Recommendations } from "./grade-analysis";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FullReportModal } from "./full-report-modal";
import PersonalizedHeader from "./personalized-header";

export function FoodDiaryApp() {
  const [formData, setFormData] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: "",
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);

    if (!Object.values(formData).some((value) => value.trim())) {
      setError("Please enter at least one meal to analyze");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze food data");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      breakfast: "",
      lunch: "",
      dinner: "",
      snacks: "",
    });
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Header Section */}
      <PersonalizedHeader currentWeight={220} targetWeight={185} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Panel - Form and Charts (40% on desktop) */}
        <div className="lg:w-2/5 space-y-6">
          {/* Food Log Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Daily Food Log</h2>
              <p className="text-gray-600 mt-1">Record your meals for nutritional analysis</p>
            </div>
            
            <FoodLogForm
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
              loading={loading}
            />

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Macro Distribution Chart */}
          {analysis && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Macro Distribution
              </h2>
              <MacroChart macroDistribution={analysis.macroDistribution} />
            </div>
          )}

          {/* Quick Recommendations */}
          {analysis && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Recommendations
              </h2>
              <Recommendations overall={analysis.overall} />
            </div>
          )}
        </div>

        {/* Right Panel - Analysis Results (60% on desktop) */}
        <div className="lg:w-3/5 space-y-6">
          {analysis ? (
            <>
              {/* Daily Target Progress */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Daily Progress
                </h2>
                <TargetProgress targets={analysis.targets} progress={analysis} />
              </div>

              {/* Detailed Analysis Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="space-y-8">
                  {/* Food Breakdown */}
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Food Intake Breakdown
                    </h2>
                    <FoodBreakdown breakdown={analysis.foodBreakdown} />
                  </section>

                  {/* Grade Analysis */}
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Nutritional Grade Analysis
                    </h2>
                    <GradeAnalysis gradeBreakdown={analysis.gradeBreakdown} />
                  </section>

                  {/* Full Report Button */}
                  <section className="pt-4 border-t border-gray-100">
                    <FullReportModal analysis={analysis} />
                  </section>
                </div>
              </div>
            </>
          ) : (
            // Empty State
            <div className="bg-white rounded-xl shadow-sm p-8 h-96 flex flex-col items-center justify-center text-center">
              <div className="max-w-md">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Ready for Your Analysis
                </h2>
                <p className="text-gray-600 mb-2">
                  Enter your meals in the food log to get a detailed nutritional analysis
                </p>
                <p className="text-gray-500 text-sm">
                  Will provide personalized insights and recommendations based on your input
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4" />
            <p className="text-lg text-gray-700">
              Analyzing your nutrition data...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodDiaryApp;