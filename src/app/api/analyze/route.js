import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PERSONAL_STATS = {
  age: 37,
  height: 71,
  weight: 225,
  gender: "male",
  activityLevel: "moderate",
};

const calculateBMR = (stats) => {
  return (
    10 * stats.weight * 0.453592 +
    6.25 * stats.height * 2.54 -
    5 * stats.age +
    (stats.gender === "male" ? 5 : -161)
  );
};

const calculateTargets = (stats) => {
  const bmr = calculateBMR(stats);
  const activityMultipliers = {
    sedentary: 1.2,
    moderate: 1.55,
    active: 1.725,
  };

  const maintenanceCalories = bmr * activityMultipliers[stats.activityLevel];
  const weightLossCalories = maintenanceCalories - 500;

  return {
    calories: Math.round(weightLossCalories),
    protein: Math.round(stats.weight * 0.8),
    carbs: Math.round((weightLossCalories * 0.40) / 4),
    fats: Math.round((weightLossCalories * 0.30) / 9),
  };
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { breakfast, lunch, dinner, snacks } = body;

    if (!breakfast && !lunch && !dinner && !snacks) {
      return NextResponse.json(
        { error: "At least one meal input must be provided." },
        { status: 400 }
      );
    }

    const targets = calculateTargets(PERSONAL_STATS);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert nutritionist and supportive wellness coach who provides detailed nutrition analysis focused on sustainable weight loss and healthy lifestyle changes. Your analysis should be thorough yet encouraging, highlighting both achievements and areas for improvement.

Consider the following in your analysis:
- Daily progress towards macro and calorie targets
- Meal timing and portion distribution
- Food quality and nutrient density
- Protein sources and distribution throughout the day
- Fiber intake and whole food content
- Hydration implications of food choices
- Practical, actionable improvements
- Long-term sustainability of choices

Your grading system should consider:
A (90-100%): Excellent alignment with goals, optimal macro distribution, high-quality food choices
B (80-89%): Good progress, minor adjustments needed
C (70-79%): On track but significant improvements possible
D (60-69%): Major adjustments needed but some positive elements
F (<60%): Requires immediate attention and restructuring

Provide specific, actionable recommendations that acknowledge the challenge of lifestyle changes while maintaining an encouraging, supportive tone.`,
        },
        {
          role: "user",
          content: `Analyze these meals for a 37-year-old male, 5'11", 225 lbs with these daily targets:
- Calories: ${targets.calories} (${Math.round(targets.calories * 0.1)} cal flexibility range)
- Protein: ${targets.protein}g (crucial for muscle preservation)
- Carbs: ${targets.carbs}g (for energy and workout performance)
- Fats: ${targets.fats}g (for hormone health and satiety)

Current meals:
${breakfast ? `Breakfast: ${breakfast}` : ""}
${lunch ? `Lunch: ${lunch}` : ""}
${dinner ? `Dinner: ${dinner}` : ""}
${snacks ? `Snacks: ${snacks}` : ""}

Please provide:
1. Detailed breakdown of nutrients and progress towards daily targets
2. Analysis of meal timing and portion distribution
3. Specific grades for: macro balance, food quality, meal timing, and overall adherence
4. Personalized recommendations for improvement
5. Words of encouragement highlighting positive choices made`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "analysis",
          schema: {
            type: "object",
            properties: {
              foodBreakdown: {
                type: "object",
                required: ["headers", "rows", "totals", "targetPercentages"],
                properties: {
                  headers: {
                    type: "array",
                    items: { type: "string" },
                  },
                  rows: {
                    type: "array",
                    items: {
                      type: "array",
                      items: { type: ["string", "number"] },
                    },
                  },
                  totals: {
                    type: "array",
                    items: { type: ["string", "number"] },
                  },
                  targetPercentages: {
                    type: "array",
                    items: { type: "number" },
                  },
                },
              },
              macroDistribution: {
                type: "object",
                required: ["protein", "carbs", "fat"],
                properties: {
                  protein: {
                    type: "object",
                    required: ["percentage", "targetMet"],
                    properties: {
                      percentage: { type: "number" },
                      targetMet: { type: "number" },
                    },
                  },
                  carbs: {
                    type: "object",
                    required: ["percentage", "targetMet"],
                    properties: {
                      percentage: { type: "number" },
                      targetMet: { type: "number" },
                    },
                  },
                  fat: {
                    type: "object",
                    required: ["percentage", "targetMet"],
                    properties: {
                      percentage: { type: "number" },
                      targetMet: { type: "number" },
                    },
                  },
                },
              },
              gradeBreakdown: {
                type: "object",
                required: ["headers", "rows"],
                properties: {
                  headers: {
                    type: "array",
                    items: { type: "string" },
                  },
                  rows: {
                    type: "array",
                    items: {
                      type: "array",
                      items: { type: ["string", "number"] },
                    },
                  },
                },
              },
              overall: {
                type: "object",
                required: ["grade", "recommendations"],
                properties: {
                  grade: { type: "string" },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
              },
            },
            required: [
              "foodBreakdown",
              "macroDistribution",
              "gradeBreakdown",
              "overall",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response received from the OpenAI API");
    }

    let analysis;
    try {
      analysis = JSON.parse(content.trim());
    } catch (parseError) {
      console.error("Original content:", content);
      console.error("Parse error:", parseError);
      throw new Error("Failed to parse nutritional analysis JSON");
    }

    // Attach the calculated targets
    analysis.targets = targets;

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing food:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to analyze food data",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}