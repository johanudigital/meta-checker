import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export const runtime = 'edge';

const MAX_SITEMAPS = 100;

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

async function fetchAndParseSitemap(url: string, sitemaps: string[]): Promise<void> {
  if (sitemaps.length >= MAX_SITEMAPS) return;

  const response = await fetchWithTimeout(url);
  const content = await response.text();
  const parser = new XMLParser();
  const result = parser.parse(content);

  if (result.sitemapindex && result.sitemapindex.sitemap) {
    // This is a sitemap index
    const sitemapEntries = Array.isArray(result.sitemapindex.sitemap) 
      ? result.sitemapindex.sitemap 
      : [result.sitemapindex.sitemap];
    
    for (const entry of sitemapEntries) {
      if (entry.loc && !sitemaps.includes(entry.loc)) {
        sitemaps.push(entry.loc);
        if (sitemaps.length >= MAX_SITEMAPS) return;
        // Recursively fetch nested sitemaps
        await fetchAndParseSitemap(entry.loc, sitemaps);
      }
    }
  } else if (result.urlset && result.urlset.url) {
    // This is a regular sitemap
    if (!sitemaps.includes(url)) {
      sitemaps.push(url);
    }
  }
}

async function findSitemaps(domain: string): Promise<string[]> {
  console.log('Searching for sitemaps for domain:', domain);
  const robotsTxtUrl = `https://${domain}/robots.txt`;
  let sitemaps: string[] = [];

  try {
    const response = await fetchWithTimeout(robotsTxtUrl);
    if (response.ok) {
      const text = await response.text();
      console.log('robots.txt content:', text);
      const sitemapMatches = text.match(/Sitemap: (.*)/gi);
      if (sitemapMatches) {
        for (const match of sitemapMatches) {
          const url = match.split(': ')[1].trim();
          await fetchAndParseSitemap(url, sitemaps);
          if (sitemaps.length >= MAX_SITEMAPS) break;
        }
      }
    } else {
      console.log('robots.txt not found or inaccessible');
    }
  } catch (error) {
    console.error('Error fetching robots.txt:', error);
  }

  if (sitemaps.length === 0) {
    console.log('No sitemaps found in robots.txt, checking common locations');
    const commonLocations = [
      `https://${domain}/sitemap.xml`,
      `https://${domain}/sitemap_index.xml`,
      `https://${domain}/sitemap-index.xml`,
    ];

    for (const location of commonLocations) {
      try {
        await fetchAndParseSitemap(location, sitemaps);
        if (sitemaps.length > 0) break;
      } catch (error) {
        console.error(`Error checking ${location}:`, error);
      }
    }
  }

  console.log(`Found ${sitemaps.length} sitemaps (limited to ${MAX_SITEMAPS})`);
  return sitemaps;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    console.log('Received URL:', url);

    // Ensure the URL has a protocol
    const formattedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const domain = new URL(formattedUrl).hostname;
    
    const sitemaps = await findSitemaps(domain);

    return NextResponse.json({ sitemaps });
  } catch (error) {
    console.error('Error processing URL:', error);
    return NextResponse.json({ error: 'Failed to process URL', details: error.message }, { status: 500 });
  }
}