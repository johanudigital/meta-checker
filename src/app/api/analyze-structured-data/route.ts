import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { structuredData } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert in structured data and SEO. Analyze the given structured data and provide insights."
        },
        {
          role: "user",
          content: `Analyze this structured data and provide insights: ${JSON.stringify(structuredData)}`
        }
      ],
    });
    const analysis = completion.choices[0]?.message?.content || 'No analysis available';
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing structured data:', error);
    return NextResponse.json({ error: 'Failed to analyze structured data' }, { status: 500 });
  }
}
