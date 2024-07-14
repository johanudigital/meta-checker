import { NextResponse } from 'next/server';

export const runtime = 'edge';

async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    console.log('Received URL:', url);

    const formattedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const robotsTxtUrl = new URL('/robots.txt', formattedUrl).toString();

    const response = await fetchWithTimeout(robotsTxtUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch robots.txt: ${response.statusText}`);
    }

    const content = await response.text();
    console.log('Robots.txt content:', content);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error processing URL:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return NextResponse.json({ error: 'Failed to process URL', details: errorMessage }, { status: 500 });
  }
}