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
          content: "You are an expert in structured data and SEO. Optimize the given structured data for better SEO performance."
        },
        {
          role: "user",
          content: `Optimize this structured data for better SEO: ${JSON.stringify(structuredData)}`
        }
      ],
    });
    const optimization = completion.choices[0]?.message?.content || 'No optimization available';
    return NextResponse.json({ optimization });
  } catch (error) {
    console.error('Error optimizing structured data:', error);
    return NextResponse.json({ error: 'Failed to optimize structured data' }, { status: 500 });
  }
}
