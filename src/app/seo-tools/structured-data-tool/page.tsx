// src/app/seo-tools/structured-data-tool/page.tsx

'use client';

import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

enum Tab {
  URL,
  Code
}

export default function StructuredDataChecker() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.URL);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any | null>(null);

  const handleSubmit = async () => {
    // Here you would implement the actual checking logic
    // For now, we'll just set some dummy results
    setResults({
      type: 'Recipe',
      errors: 0,
      warnings: 0,
      properties: {
        name: 'Mini quiches met groenten',
        description: 'Heerlijk recept voor mini quiches met groenten...',
        // ... other properties
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Structured Data Tool</h1>
      <Card className="p-4">
        <div className="flex mb-4">
          <Button
            onClick={() => setActiveTab(Tab.URL)}
            className={`mr-2 ${activeTab === Tab.URL ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            URL ophalen
          </Button>
          <Button
            onClick={() => setActiveTab(Tab.Code)}
            className={activeTab === Tab.Code ? 'bg-blue-500' : 'bg-gray-200'}
          >
            Codefragment
          </Button>
        </div>
        <Input
          placeholder={activeTab === Tab.URL ? "Geef een URL op" : "Plak je code hier"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mb-4"
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
          <h2 className="text-xl font-bold mb-2">{results.type}</h2>
          <p>{results.errors} FOUTEN {results.warnings} WAARSCHUWINGEN</p>
          <div className="mt-4">
            {Object.entries(results.properties).map(([key, value]) => (
              <div key={key} className="mb-2">
                <strong>{key}:</strong> {value as string}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
