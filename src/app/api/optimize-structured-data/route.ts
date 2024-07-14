import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export async function POST(req: Request) {
  try {
    const { action, data } = await req.json();

    if (action === 'fetch-url') {
      if (!isValidUrl(data.url)) {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
      }

      const response = await fetch(data.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      return NextResponse.json({ content });
    } else if (action === 'optimize') {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert in structured data and SEO. Optimize the given structured data for better SEO performance."
          },
          {
            role: "user",
            content: `Optimize this structured data for better SEO: ${JSON.stringify(data.structuredData)}`
          }
        ],
      });
      const optimization = completion.choices[0]?.message?.content || 'No optimization available';
      return NextResponse.json({ optimization });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request', details: (error as Error).message }, { status: 500 });
  }
}