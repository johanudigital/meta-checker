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
          content: "You are a URL analyzer. Analyze the given URL and provide information about its safety, content type, and sentiment."
        },
        {
          role: "user",
          content: `Analyze this URL: ${url}`
        }
      ],
    });

    const analysis = completion.choices[0].message.content;
    
    // Parse the analysis string to extract structured data
    const safety = analysis.toLowerCase().includes('safe') ? 'safe' : 'unsafe';
    const content = analysis.toLowerCase().includes('news') ? 'news' : 
                    analysis.toLowerCase().includes('blog') ? 'blog' : 'social media';
    const sentiment = analysis.toLowerCase().includes('positive') ? 'positive' : 
                      analysis.toLowerCase().includes('negative') ? 'negative' : 'neutral';

    return NextResponse.json({ safety, content, sentiment });
  } catch (error) {
    console.error('Error analyzing URL:', error);
    return NextResponse.json({ error: 'Failed to analyze URL' }, { status: 500 });
  }
}