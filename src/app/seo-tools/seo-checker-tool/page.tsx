// src/app/seo-tools/seo-checker-tool/page.tsx

'use client';

import React, { useState } from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";

interface SEOResult {
  value: string | number | boolean;
  status: 'ok' | 'warning' | 'error';
  message: string;
}

interface SEOCheckResult {
  url: string;
  title: SEOResult;
  metaDescription: SEOResult;
  headings: SEOResult;
  images: SEOResult;
  ssl: SEOResult;
}

export default function SEOChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<SEOCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkSEO = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch SEO data');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const ResultItem = ({ title, result }: { title: string; result: SEOResult }) => (
    <div className="mb-4">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm">
        <span className={`inline-block px-2 py-1 rounded mr-2 ${
          result.status === 'ok' ? 'bg-green-200 text-green-800' :
          result.status === 'warning' ? 'bg-yellow-200 text-yellow-800' :
          'bg-red-200 text-red-800'
        }`}>
          {result.status.toUpperCase()}
        </span>
        {result.message}
      </p>
      <p className="text-xs text-gray-500">Value: {result.value.toString()}</p>
    </div>
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SEO Checker</h1>
      <div className="mb-4">
        <Label htmlFor="url-input">Enter URL to check (with or without http/https)</Label>
        <div className="flex">
          <Input
            id="url-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            className="flex-grow mr-2"
          />
          <Button onClick={checkSEO} disabled={loading}>
            {loading ? 'Checking...' : 'Check SEO'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Results for {result.url}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultItem title="Title" result={result.title} />
            <ResultItem title="Meta Description" result={result.metaDescription} />
            <ResultItem title="Headings" result={result.headings} />
            <ResultItem title="Images" result={result.images} />
            <ResultItem title="SSL" result={result.ssl} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}