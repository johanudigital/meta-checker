import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
type CheerioAPI = ReturnType<typeof cheerio.load>;


export async function POST(request: NextRequest) {
  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  try {
    const formattedUrl = formatUrl(url);
    const results = await checkSEO(formattedUrl);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Error checking SEO' }, { status: 500 });
  }
}

function formatUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

async function checkSEO(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    return {
      url,
      title: checkTitleTag($),
      metaDescription: checkMetaDescription($),
      headings: checkHeadings($),
      images: checkImages($),
      ssl: checkSSL(url),
    };
  } catch (error) {
    console.error(`Error checking SEO for ${url}:`, error);
    return { 
      error: 'Unable to fetch or analyze this URL. Please check if the URL is correct and accessible.',
      status: 500 
    };
  }
}

function checkTitleTag($: CheerioAPI) {
  const title = $('title').text().trim();
  return {
    value: title,
    status: title.length > 0 && title.length <= 60 ? 'ok' : 'warning',
    message: title.length === 0 ? 'Missing title tag' :
      title.length > 60 ? 'Title tag is too long (over 60 characters)' :
      'Title tag is present and within recommended length',
  };
}

function checkMetaDescription($: CheerioAPI) {
  const description = $('meta[name="description"]').attr('content')?.trim() || '';
  return {
    value: description,
    status: description && description.length <= 160 ? 'ok' : 'warning',
    message: !description ? 'Missing meta description' :
      description.length > 160 ? 'Meta description is too long (over 160 characters)' :
      'Meta description is present and within recommended length',
  };
}

function checkHeadings($: CheerioAPI) {
  const h1Count = $('h1').length;
  return {
    value: h1Count,
    status: h1Count === 1 ? 'ok' : 'warning',
    message: h1Count === 0 ? 'No H1 tag found' :
      h1Count > 1 ? 'Multiple H1 tags found' :
      'Single H1 tag found',
  };
}

function checkImages($: CheerioAPI) {
  const images = $('img');
  const imagesWithoutAlt = images.filter((i, el) => !$(el).attr('alt'));
  return {
    value: `${images.length - imagesWithoutAlt.length}/${images.length}`,
    status: imagesWithoutAlt.length === 0 ? 'ok' : 'warning',
    message: imagesWithoutAlt.length > 0 ?
      `${imagesWithoutAlt.length} image(s) missing alt text` :
      'All images have alt text',
  };
}

function checkSSL(url: string) {
  const isHttps = url.startsWith('https');
  return {
    value: isHttps,
    status: isHttps ? 'ok' : 'warning',
    message: isHttps ? 'HTTPS is enabled' : 'Site is not using HTTPS',
  };
}