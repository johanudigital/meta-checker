'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

interface AnalysisResult {
  safety: string;
  content: string;
  sentiment: string;
}

const UrlAnalyzer = () => {
  const [url, setUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeUrl = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze URL');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Failed to analyze URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>URL Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="url"
            placeholder="Enter URL to analyze"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={analyzeUrl} disabled={!url || loading} className="w-full">
            {loading ? 'Analyzing...' : 'Analyze URL'}
          </Button>
          
          {error && (
            <div className="flex items-center text-red-500">
              <AlertCircle className="mr-2" />
              {error}
            </div>
          )}
          
          {analysis && (
            <div className="space-y-2">
              <h3 className="font-semibold">Analysis Results:</h3>
              <p>
                <CheckCircle className="inline mr-2" color={analysis.safety === 'safe' ? 'green' : 'red'} />
                Safety: {analysis.safety}
              </p>
              <p>Content Type: {analysis.content}</p>
              <p>Sentiment: {analysis.sentiment}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UrlAnalyzer;
