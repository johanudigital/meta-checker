'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RobotsTxtAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [robotsTxtContent, setRobotsTxtContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setRobotsTxtContent('');

    try {
      const response = await fetch('/api/analyze-robots-txt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch robots.txt');
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setRobotsTxtContent(data.content);
      }
    } catch (error) {
      setError('An error occurred while fetching the robots.txt file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Robots.txt Analyzer</h1>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Column */}
        <div className="w-full md:w-1/3">
          <Card className="p-4">
            <input
              type="text"
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <Button 
              onClick={handleSubmit} 
              className="w-full bg-blue-500 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Analyze Robots.txt'}
            </Button>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="w-full md:w-2/3">
          <Card className="p-4">
            <h2 className="text-xl font-bold mb-2">Results</h2>
            {error && (
              <p className="text-red-500 mb-2">{error}</p>
            )}
            {robotsTxtContent && (
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                {robotsTxtContent}
              </pre>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RobotsTxtAnalyzer;