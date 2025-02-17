import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    
    if (!body.analysis) {
      return NextResponse.json(
        { error: 'No analysis data provided' },
        { status: 400 }
      );
    }

    const { analysis } = body;

    // Parse food log entries to get total quantities
    const meals = analysis.meals || {};
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    // Calculate meal-specific metrics if available
    const mealMetrics = Object.entries(meals).map(([meal, items]) => {
      // Assume items are semicolon-separated
      const foodItems = items.split(';').map(item => item.trim()).filter(Boolean);
      return {
        meal: meal.charAt(0).toUpperCase() + meal.slice(1),
        items: foodItems,
        itemCount: foodItems.length
      };
    });

    const prompt = `Generate a detailed nutritional analysis report using the following format:

**Overall Grade**
[Provide a letter grade (A, B, C, D, or F) with optional + or - that reflects the overall nutritional quality. Consider meal balance, portion sizes, and nutrient density.]

**Food Log**
[List the meals as entered, organized by meal time]
${mealMetrics.map(m => `${m.meal}:\n${m.items.join('\n')}`).join('\n\n')}

**Nutritional Breakdown**
[Create a table showing estimated nutritional content for each meal]
Meal        Calories    Protein(g)    Carbs(g)    Fat(g)
${mealMetrics.map(m => m.meal).join('\n')}
Total       [Sum]       [Sum]         [Sum]       [Sum]

**Summary**
[Provide 3-4 bullet points analyzing:]
* Overall caloric intake and distribution across meals
* Macro-nutrient balance
* Meal timing and portion sizes
* Food quality and nutrient density

**Recommendations**
[Provide 3-5 specific, actionable recommendations focusing on:]
* Portion size adjustments if needed
* Meal timing suggestions
* Food quality improvements
* Macro-nutrient balance optimization
* Specific food additions or substitutions

Base your analysis on these meal details:
${JSON.stringify(mealMetrics, null, 2)}`;

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a precise nutritional analysis engine. Format your response exactly as requested with markdown-style section headers (**Section**). Provide specific, data-driven analysis and actionable recommendations. Use bullet points for lists and proper spacing for the table format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "gpt-4o",
        temperature: 0.3,
        max_tokens: 1500
      });

      // Clean up the response format
      const formattedReport = completion.choices[0].message.content
        .replace(/\n{3,}/g, '\n\n')  // Replace multiple newlines with double newline
        .replace(/\*\*/g, '**')      // Ensure consistent markdown headers
        .trim();

      return NextResponse.json({ 
        report: formattedReport,
        status: 'success' 
      });
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      return NextResponse.json(
        { 
          error: 'Error generating the report. Please try again.'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while processing your request.'
      },
      { status: 500 }
    );
  }
}