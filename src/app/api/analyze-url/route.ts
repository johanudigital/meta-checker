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
          content: "You are a URL analyzer. Analyze the given URL and provide detailed information about its content, purpose, and potential risks or benefits."
        },
        {
          role: "user",
          content: `Analyze this URL: ${url}`
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
