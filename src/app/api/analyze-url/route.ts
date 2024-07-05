import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert content writer and SEO specialist. You write the ultimate meta titles and meta descriptions based on an URL."
        },
        {
          role: "user",
          content: `Write a meta title and meta description based on the website content retrieved from this URL: ${url}`
        }
      ],
    });

    const analysis = completion.choices[0]?.message?.content || 'No analysis available';

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing URL:', error);
    return NextResponse.json({ error: 'Failed to analyze URL' }, { status: 500 });
  }
}
