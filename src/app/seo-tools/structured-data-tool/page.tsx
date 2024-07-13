'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

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
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Code);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<ValidationResult | null>(null);
  const [aiOptimization, setAiOptimization] = useState<string | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'validation' | 'optimization'>('validation');
  const [lastOptimizationTime, setLastOptimizationTime] = useState<number>(0);

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

      // Ensure the @context URL uses HTTPS
      if (jsonData['@context'] === 'http://schema.org') {
        jsonData['@context'] = 'https://schema.org';
      }

      // Dynamically import jsonld
      const jsonld = await import('jsonld');

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

  const handleSubmit = async () => {
    let jsonLdStrings: string[];
    if (input.trim().startsWith('{') || input.trim().startsWith('[')) {
      jsonLdStrings = [input];
    } else {
      jsonLdStrings = extractJsonLd(input);
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
  };

  const handleAiOptimization = async () => {
    if (!results?.isValid || !results.data) {
      alert('Please validate your structured data first.');
      return;
    }

    const currentTime = Date.now();
    if (currentTime - lastOptimizationTime < 20000) {
      alert('Please wait 20 seconds before requesting another optimization.');
      return;
    }

    try {
      const response = await fetch('/api/optimize-structured-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ structuredData: results.data }),
      });

      if (!response.ok) throw new Error('Failed to optimize structured data');

      const data = await response.json();
      setAiOptimization(data.optimization);
      setLastOptimizationTime(currentTime);
    } catch (error) {
      console.error('Error optimizing structured data:', error);
      setAiOptimization('Failed to optimize structured data');
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
              <Button onClick={handleSubmit} className="bg-green-500 text-white">
                Validate
              </Button>
              <Button onClick={handleAiOptimization} className="bg-purple-500 text-white" disabled={!results?.isValid}>
                Optimize with AI
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
                className={activeResultTab === 'optimization' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
              >
                AI Optimization
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
                  <p>{aiOptimization}</p>
                ) : (
                  <p>No AI optimization available. Click &quot;Optimize with AI&quot; to generate optimizations.</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}