'use client';

import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import AIOptimizationDisplay from '../../../components/ui/AIOptimizationDisplay';

enum Tab {
  URL,
  Code
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

interface ValidationResult {
  isValid: boolean;
  data: StructuredData[] | null;
  error: string | null;
}

export default function StructuredDataTool() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.URL);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<ValidationResult | null>(null);
  const [aiOptimization, setAiOptimization] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'validation' | 'optimization' | 'suggestion'>('validation');
  const [lastApiCallTime, setLastApiCallTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatUrl = (url: string): string => {
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const extractJsonLd = (html: string): string[] => {
    const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      try {
        const jsonData = JSON.parse(match[1].trim());
        matches.push(JSON.stringify(jsonData));
      } catch (error) {
        console.error('Failed to parse JSON-LD:', error, match[1].trim());
      }
    }
    return matches;
  };

  const validateJsonLd = async (jsonString: string): Promise<StructuredData | null> => {
    try {
      const jsonData = JSON.parse(jsonString);

      if (jsonData['@context'] === 'http://schema.org') {
        jsonData['@context'] = 'https://schema.org';
      }

      const jsonldModule = await import('jsonld');
      const jsonld = jsonldModule.default;

      const expanded = await jsonld.expand(jsonData);
      if (expanded.length > 0) {
        const compacted = await jsonld.compact(expanded[0], {});
        return compacted as StructuredData;
      }
      return null;
    } catch (error) {
      console.error('Error validating JSON-LD:', error);
      return null;
    }
  };

  const fetchDataFromUrl = async (url: string): Promise<string> => {
    const formattedUrl = formatUrl(url);
    if (!isValidUrl(formattedUrl)) {
      throw new Error('Invalid URL format');
    }

    const response = await fetch('/api/optimize-structured-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'fetch-url', data: { url: formattedUrl } }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch data from URL');
    }

    const data = await response.json();
    return data.content;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setResults(null);
    setAiOptimization(null);
    try {
      let jsonLdStrings: string[];
      if (activeTab === Tab.URL) {
        const htmlContent = await fetchDataFromUrl(input);
        jsonLdStrings = extractJsonLd(htmlContent);
      } else {
        if (input.trim().startsWith('{') || input.trim().startsWith('[')) {
          jsonLdStrings = [input];
        } else {
          jsonLdStrings = extractJsonLd(input);
        }
      }

      if (jsonLdStrings.length === 0) {
        setResults({
          isValid: false,
          data: null,
          error: 'No valid JSON-LD found in the input. Make sure the input contains properly formatted JSON-LD scripts.'
        });
        return;
      }

      const validatedData = await Promise.all(jsonLdStrings.map(validateJsonLd));
      const filteredData = validatedData.filter((data): data is StructuredData => data !== null);

      setResults({
        isValid: filteredData.length > 0,
        data: filteredData,
        error: filteredData.length === 0 ? 'JSON-LD found but failed validation. Please check the format.' : null
      });
    } catch (error) {
      console.error('Error processing input:', error);
      setResults({
        isValid: false,
        data: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred while processing the input.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiOptimization = async () => {
    if (!results?.isValid || !results.data) {
      alert('Please validate your structured data first.');
      return;
    }

    const currentTime = Date.now();
    if (currentTime - lastApiCallTime < 20000) {
      alert('Please wait 20 seconds before requesting another optimization.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/optimize-structured-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'optimize', data: { structuredData: results.data } }),
      });

      if (!response.ok) throw new Error('Failed to optimize structured data');

      const data = await response.json();
      setAiOptimization(data.optimization);
      setLastApiCallTime(currentTime);
    } catch (error) {
      console.error('Error optimizing structured data:', error);
      setAiOptimization('Failed to optimize structured data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiSuggestion = async () => {
    const currentTime = Date.now();
    if (currentTime - lastApiCallTime < 20000) {
      alert('Please wait 20 seconds before requesting another suggestion.');
      return;
    }

    setIsLoading(true);
    try {
      let htmlContent: string;
      if (activeTab === Tab.URL) {
        htmlContent = await fetchDataFromUrl(input);
      } else {
        htmlContent = input;
      }

      const response = await fetch('/api/optimize-structured-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggest', data: { htmlContent } }),
      });

      if (!response.ok) throw new Error('Failed to suggest structured data');

      const data = await response.json();
      setAiSuggestion(data.suggestion);
      setLastApiCallTime(currentTime);
      setActiveResultTab('suggestion');
    } catch (error) {
      console.error('Error suggesting structured data:', error);
      setAiSuggestion('Failed to suggest structured data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Structured Data Tool</h1>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Column */}
        <div className="w-full md:w-1/3">
          <Card className="p-4">
            <div className="flex mb-4">
              <Button
                onClick={() => setActiveTab(Tab.URL)}
                className={`mr-2 ${activeTab === Tab.URL ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                URL ophalen
              </Button>
              <Button
                onClick={() => setActiveTab(Tab.Code)}
                className={activeTab === Tab.Code ? 'bg-blue-500 text-white' : 'bg-gray-200'}
              >
                Codefragment
              </Button>
            </div>
            <textarea
              placeholder={activeTab === Tab.URL ? "Geef een URL op" : "Plak je HTML of JSON-LD code hier"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 p-2 border rounded mb-4"
            />
            <div className="flex flex-col space-y-2">
              <Button onClick={handleSubmit} className="bg-green-500 text-white" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Validate'}
              </Button>
              <Button onClick={handleAiOptimization} className="bg-purple-500 text-white" disabled={!results?.isValid || isLoading}>
                {isLoading ? 'Optimizing...' : 'Optimize with AI'}
              </Button>
              <Button onClick={handleAiSuggestion} className="bg-blue-500 text-white" disabled={isLoading}>
                {isLoading ? 'Suggesting...' : 'Suggest Structured Data'}
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="w-full md:w-2/3">
          <Card className="p-4">
            <div className="flex mb-4">
              <Button
                onClick={() => setActiveResultTab('validation')}
                className={`mr-2 ${activeResultTab === 'validation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Validation Results
              </Button>
              <Button
                onClick={() => setActiveResultTab('optimization')}
                className={`mr-2 ${activeResultTab === 'optimization' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                AI Optimization
              </Button>
              <Button
                onClick={() => setActiveResultTab('suggestion')}
                className={activeResultTab === 'suggestion' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
              >
                AI Suggestion
              </Button>
            </div>
            
            {activeResultTab === 'validation' && results && (
              <div>
                <h2 className="text-xl font-bold mb-2">Validation Results</h2>
                {results.isValid ? (
                  <>
                    <p className="text-green-500 mb-2">Valid Structured Data Found</p>
                    {results.data?.map((item, index) => (
                      <div key={index} className="mb-4">
                        <p><strong>Type:</strong> {item['@type']}</p>
                        <pre className="bg-gray-100 p-2 mt-2 rounded overflow-x-auto">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-red-500">Error: {results.error}</p>
                )}
              </div>
            )}

            {activeResultTab === 'optimization' && (
              <div>
                <h2 className="text-xl font-bold mb-2">AI Optimization</h2>
                {aiOptimization ? (
                  <AIOptimizationDisplay optimization={aiOptimization} />
                ) : (
                  <p>No AI optimization available. Click &quot;Optimize with AI&quot; to generate optimizations.</p>
                )}
              </div>
            )}

            {activeResultTab === 'suggestion' && (
              <div>
                <h2 className="text-xl font-bold mb-2">AI Suggestion</h2>
                {aiSuggestion ? (
                  <AIOptimizationDisplay optimization={aiSuggestion} />
                ) : (
                  <p>No AI suggestion available. Click &quot;Suggest Structured Data&quot; to generate suggestions.</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}