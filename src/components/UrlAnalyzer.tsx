'use client';
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

interface AnalysisResult {
  analysis: string;
}

const UrlAnalyzer = () => {
  const [url, setUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeUrl = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

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
    <Card className="w-full max-w-xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800">SEO Analyzer</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex space-x-2">
          <Input
            type="url"
            placeholder="Enter URL to analyze"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow"
          />
          <Button 
            onClick={analyzeUrl} 
            disabled={!url || loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Analyze'}
          </Button>
        </div>
        
        {error && (
          <div className="flex items-center text-red-500 bg-red-50 p-3 rounded-md">
            <AlertCircle className="mr-2 h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {analysis && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">Analysis Results:</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{analysis.analysis}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlAnalyzer;
