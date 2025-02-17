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

    const prompt = `Generate a data-driven nutritional report based on the following analysis data. The report must include:

1. Overall Daily Grade: Provide an initial grade (A, B, C, D, or F) that reflects overall nutritional adherence.
2. Summary Tables:
   - Calories Table: Summarize the total calorie intake for each meal (breakfast, lunch, dinner, snacks) and include the overall total.
   - Macro Breakdown Table: List Protein, Carbohydrates, and Fats with the amount consumed and the percentage of the daily target achieved.
3. Recommendations: Provide specific, actionable recommendations for improving nutrition, focusing on food quality, portion sizes, and meal timing.
4. Data Summary: Offer a concise summary emphasizing key nutritional metrics, particularly calories and macros.

Meal Data:
${JSON.stringify(analysis.meals || {}, null, 2)}

Macro Distribution Data:
${JSON.stringify(analysis.macroDistribution, null, 2)}

Food Intake Details:
${JSON.stringify(analysis.foodBreakdown, null, 2)}

Output the report as plain text with clear headings, text-based tables, and bullet points where applicable.`;

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a data-driven nutritional analysis engine. Your output must be objective, concise, and formatted as plain text with an emphasis on numerical data and clear recommendations."
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

      const formattedReport = completion.choices[0].message.content
        .replace(/\n\n\n+/g, '\n\n')
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
