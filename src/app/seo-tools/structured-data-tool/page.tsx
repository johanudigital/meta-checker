'use client';

import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import jsonld from 'jsonld';

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
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiOptimization, setAiOptimization] = useState<string | null>(null);

  const extractJsonLd = (html: string): string[] => {
  const regex = /<script[^>]*type=("|\')application\/ld\+json("|\')[^>]*>([\s\S]*?)<\/script>/gi;
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      // Attempt to parse the JSON to ensure it's valid
      const jsonData = JSON.parse(match[3].trim());
      matches.push(JSON.stringify(jsonData));
    } catch (error) {
      console.error('Failed to parse JSON-LD:', error);
    }
  }
  return matches;
};

  const validateJsonLd = async (jsonString: string): Promise<StructuredData | null> => {
    try {
      const parsedData = JSON.parse(jsonString);
      const compacted = await jsonld.compact(parsedData, parsedData['@context']);
      return compacted as StructuredData;
    } catch (error) {
      console.error('Error validating JSON-LD:', error);
      return null;
    }
  };

const handleSubmit = async () => {
  if (activeTab === Tab.Code) {
    let jsonLdStrings: string[];
    if (input.trim().startsWith('{') || input.trim().startsWith('[')) {
      // Input is likely JSON-LD
      jsonLdStrings = [input];
    } else {
      // Input is likely HTML
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
    const validData = validatedData.filter((data): data is StructuredData => data !== null);

    setResults({
      isValid: validData.length > 0,
      data: validData,
      error: validData.length === 0 ? 'JSON-LD found but failed validation. Please check the format.' : null
    });
  } else {
    // URL functionality will be implemented later
    setResults({
      isValid: false,
      data: null,
      error: 'URL checking is not implemented yet'
    });
  }
};

  const handleAiAnalysis = async () => {
    if (!results?.isValid || !results.data) {
      alert('Please validate your structured data first.');
      return;
    }

    try {
      const response = await fetch('/api/analyze-structured-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ structuredData: results.data }),
      });

      if (!response.ok) throw new Error('Failed to analyze structured data');

      const data = await response.json();
      setAiAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing structured data:', error);
      setAiAnalysis('Failed to analyze structured data');
    }
  };

  const handleAiOptimization = async () => {
    if (!results?.isValid || !results.data) {
      alert('Please validate your structured data first.');
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
    } catch (error) {
      console.error('Error optimizing structured data:', error);
      setAiOptimization('Failed to optimize structured data');
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Structured Data Tool</h1>
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
          className="w-full h-32 p-2 border rounded mb-4"
        />
        <div className="flex justify-between">
          <Button onClick={() => setInput('')} className="bg-gray-200">
            Sluiten
          </Button>
          <Button onClick={handleSubmit} className="bg-red-500 text-white">
            Test uitvoeren
          </Button>
        </div>
      </Card>
      {results && (
        <Card className="mt-4 p-4">
          <h2 className="text-xl font-bold mb-2">Results</h2>
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
              <div className="mt-4 space-x-2">
                <Button onClick={handleAiAnalysis} className="bg-blue-500 text-white">
                  Analyze with AI
                </Button>
                <Button onClick={handleAiOptimization} className="bg-green-500 text-white">
                  Optimize with AI
                </Button>
              </div>
            </>
          ) : (
            <p className="text-red-500">Error: {results.error}</p>
          )}
        </Card>
      )}
      {aiAnalysis && (
        <Card className="mt-4 p-4">
          <h2 className="text-xl font-bold mb-2">AI Analysis</h2>
          <p>{aiAnalysis}</p>
        </Card>
      )}
      {aiOptimization && (
        <Card className="mt-4 p-4">
          <h2 className="text-xl font-bold mb-2">AI Optimization</h2>
          <p>{aiOptimization}</p>
        </Card>
      )}
    </div>
  );
}
