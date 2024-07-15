import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { JSDOM } from 'jsdom';

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

async function htmlToPlainText(html: string): Promise<string> {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Remove script and style elements
  const scripts = document.getElementsByTagName('script');
  const styles = document.getElementsByTagName('style');
  Array.from(scripts).forEach(script => script.remove());
  Array.from(styles).forEach(style => style.remove());
  
  // Extract text content
  return document.body.textContent || "";
}

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
            content: `You are an AI assistant specialized in optimizing structured data for websites. Your role is to analyze provided structured data and suggest improvements or additions to enhance website SEO and online presence. You must provide detailed explanations and justifications for each suggestion.
            Key requirements:
            
            - Base all suggestions on the provided data and general best practices.
            - Do not use external sources or make assumptions about website content beyond what's provided.
            - Provide detailed explanations for each suggestion.
            - Adhere to schema.org standards and Google's structured data guidelines.
            - Present your output in a clear, structured format with explanations.`
          },
          {
            role: "user",
            content: `Analyze the following structured data and provide optimization suggestions:
            
            ${JSON.stringify(data.structuredData)}
            
            Follow these steps in your analysis and response:
            
            Input Analysis:

            - Identify the schema.org type.
            - List all present properties.
            - Identify missing core properties for the schema type.
            
            
            Optimization Suggestions:
            For each suggestion, provide:
            a. The suggested addition or change in JSON-LD format, including context and enclosing object.
            b. A detailed explanation of why this change is beneficial.
            c. The priority level (High, Medium, Low) with justification, list the highest priority first.

            Output Format:
            For each suggestion, use the following structure:
            
            Suggestion #[number]:
            [JSON-LD snippet with the suggested change]
            Explanation: [Detailed explanation of the suggestion]
            Priority: [High/Medium/Low]
            Justification: [Reason for the assigned priority]
            
            Additional Considerations:
            
            Suggest any relevant nested entities that could enhance the structured data.
            Identify opportunities for cross-linking entities within the structured data.
            Point out any inconsistencies or potential improvements in existing properties.
            
            Ensure your response is comprehensive, providing clear explanations and justifications for each suggested optimization.`
          }
        ],
      });
      const optimization = completion.choices[0]?.message?.content || 'No optimization available';
      return NextResponse.json({ optimization });
    } else if (action === 'suggest') {
      // Convert HTML to plain text
      const plainTextContent = await htmlToPlainText(data.htmlContent);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant specialized in analyzing web content and suggesting appropriate structured data. Your role is to examine the provided content and propose relevant structured data that would enhance the website's SEO and online presence. Provide detailed explanations and justifications for each suggestion.`
          },
          {
            role: "user",
            content: `Analyze the following web content and suggest appropriate structured data:

            ${plainTextContent}
            
            Follow these steps in your analysis and response:
            
            1. Content Analysis:
            - Identify the main topic or purpose of the webpage.
            - List key information present in the content (e.g., title, headings, dates, author information, etc.).
            
            2. Structured Data Suggestions:
            For each suggestion, provide:
            a. The suggested structured data in JSON-LD format, including context and type.
            b. A detailed explanation of why this structured data is appropriate for the content.
            c. The priority level (High, Medium, Low) with justification.

            Output Format:
            For each suggestion, use the following structure:
            
            Suggestion #[number]:
            [JSON-LD snippet with the suggested structured data]
            Explanation: [Detailed explanation of the suggestion]
            Priority: [High/Medium/Low]
            Justification: [Reason for the assigned priority]
            
            Additional Considerations:
            - Suggest any relevant nested entities that could enhance the structured data.
            - Identify opportunities for using multiple schema.org types if appropriate.
            - Ensure all suggested properties can be confidently inferred from the content provided.
            
            Provide a comprehensive response with clear explanations and justifications for each suggested structured data type.`
          }
        ],
        max_tokens: 8000,  // Increased to utilize more of the 16k context
      });
      const suggestion = completion.choices[0]?.message?.content || 'No suggestion available';
      return NextResponse.json({ suggestion });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request', details: (error as Error).message }, { status: 500 });
  }
}