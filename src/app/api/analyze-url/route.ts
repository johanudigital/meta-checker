import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert with deep knowledge of website optimization techniques, including keyword analysis, meta tag evaluation, content quality, backlink analysis, and technical SEO factors. You will receive a website URL and analyze it comprehensively to provide detailed SEO recommendations."
        },
        {
          role: "user",
          content: `You will receive a website URL to analyze. Your task is to provide a comprehensive SEO analysis of the website, covering the following aspects:

1. **Keyword Analysis:**
   - Identify the primary keywords the website is targeting.

2. **Meta Tag Evaluation:**
   - Analyze the website's title tags, meta descriptions, and header tags (H1, H2, etc.).
   - Check for the presence of primary keywords in these tags and their relevance.

3. **Content Quality:**
   - Evaluate the quality and relevance of the content on the website.
   - Check for keyword density, readability, and the use of multimedia elements.

4. **Backlink Analysis:**
   - Assess the website's backlink profile, including the number and quality of backlinks.
   - Identify any toxic or low-quality backlinks that may harm the website's SEO.

5. **Technical SEO Factors:**
   - Evaluate the website's loading speed, mobile-friendliness, and overall user experience.
   - Check for proper use of schema markup and other structured data.

6. **Overall SEO Recommendations:**
   - Summarize the key findings from the analysis.
   - Provide a prioritized list of actionable SEO recommendations to improve the website's search engine ranking.

Provide your analysis in a structured format, with clear headings for each section. Ensure that the recommendations are specific, actionable, and prioritized based on their potential impact on the website's SEO performance.

Here is the website URL to analyze: ${url}`
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
