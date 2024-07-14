'use client';

import React, { useState, useRef } from 'react';

enum InputType {
  URL,
  XML,
  FILE
}

interface SitemapEntry {
  loc: string;
  lastmod: string | null;
  changefreq: string | null;
  priority: string | null;
}

interface AnalysisResult {
  totalEntries: number;
  hasLastMod: number;
  hasChangeFreq: number;
  hasPriority: number;
  changefreqAnalysis: { [key: string]: number };
  priorityAnalysis: { [key: string]: number };
  fileSize: number;
}

export default function SitemapAnalyzerTool() {
  const [inputType, setInputType] = useState<InputType>(InputType.URL);
  const [urlInput, setUrlInput] = useState('');
  const [xmlInput, setXmlInput] = useState('');
  const [sitemaps, setSitemaps] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSitemaps = async (url: string): Promise<string[]> => {
    const formattedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;

    const response = await fetch('/api/analyze-sitemap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: formattedUrl }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.sitemaps;
  };

  const analyzeSitemap = (content: string): AnalysisResult => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");
    
    const urlElements = xmlDoc.getElementsByTagName("url");
    const entries: SitemapEntry[] = Array.from(urlElements).map(urlElement => ({
      loc: urlElement.getElementsByTagName("loc")[0]?.textContent || '',
      lastmod: urlElement.getElementsByTagName("lastmod")[0]?.textContent || null,
      changefreq: urlElement.getElementsByTagName("changefreq")[0]?.textContent || null,
      priority: urlElement.getElementsByTagName("priority")[0]?.textContent || null,
    }));

    const result: AnalysisResult = {
      totalEntries: entries.length,
      hasLastMod: 0,
      hasChangeFreq: 0,
      hasPriority: 0,
      changefreqAnalysis: {},
      priorityAnalysis: {},
      fileSize: new Blob([content]).size,
    };

    entries.forEach(entry => {
      if (entry.lastmod) result.hasLastMod++;
      if (entry.changefreq) {
        result.hasChangeFreq++;
        result.changefreqAnalysis[entry.changefreq] = (result.changefreqAnalysis[entry.changefreq] || 0) + 1;
      }
      if (entry.priority) {
        result.hasPriority++;
        result.priorityAnalysis[entry.priority] = (result.priorityAnalysis[entry.priority] || 0) + 1;
      }
    });

    return result;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setXmlInput(content);
        setAnalysisResult(analyzeSitemap(content));
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSitemaps([]);
    setAnalysisResult(null);

    try {
      if (inputType === InputType.URL) {
        const foundSitemaps = await fetchSitemaps(urlInput);
        setSitemaps(foundSitemaps);
      } else if (inputType === InputType.XML) {
        setAnalysisResult(analyzeSitemap(xmlInput));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error processing sitemap:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sitemap Analyzer Tool</h1>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Column */}
        <div className="w-full md:w-1/3">
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <button
                onClick={() => setInputType(InputType.URL)}
                className={`mr-2 px-4 py-2 rounded ${inputType === InputType.URL ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                URL
              </button>
              <button
                onClick={() => setInputType(InputType.XML)}
                className={`mr-2 px-4 py-2 rounded ${inputType === InputType.XML ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                XML Content
              </button>
              <button
                onClick={() => {
                  setInputType(InputType.FILE);
                  fileInputRef.current?.click();
                }}
                className={`px-4 py-2 rounded ${inputType === InputType.FILE ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Upload File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xml"
                style={{ display: 'none' }}
              />
            </div>
            {inputType === InputType.URL && (
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter sitemap URL"
                className="w-full p-2 border rounded mb-4"
              />
            )}
            {inputType === InputType.XML && (
              <textarea
                value={xmlInput}
                onChange={(e) => setXmlInput(e.target.value)}
                placeholder="Paste sitemap XML content here"
                className="w-full h-64 p-2 border rounded mb-4"
              />
            )}
            {inputType !== InputType.FILE && (
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Analyze Sitemap'}
              </button>
            )}
          </div>
        </div>
        
        {/* Right Column */}
        <div className="w-full md:w-2/3">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Analysis Results</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {loading ? (
              <p>Loading...</p>
            ) : sitemaps.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mt-4">Found Sitemaps:</h3>
                <ul className="list-disc pl-5">
                  {sitemaps.map((sitemap, index) => (
                    <li key={index} className="mb-1">
                      <a href={sitemap} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {sitemap}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : analysisResult ? (
              <div>
                <p><strong>Total Entries:</strong> {analysisResult.totalEntries}</p>
                <p><strong>File Size:</strong> {(analysisResult.fileSize / 1024).toFixed(2)} KB</p>
                <p><strong>Entries with lastmod:</strong> {analysisResult.hasLastMod} ({((analysisResult.hasLastMod / analysisResult.totalEntries) * 100).toFixed(2)}%)</p>
                <p><strong>Entries with changefreq:</strong> {analysisResult.hasChangeFreq} ({((analysisResult.hasChangeFreq / analysisResult.totalEntries) * 100).toFixed(2)}%)</p>
                <p><strong>Entries with priority:</strong> {analysisResult.hasPriority} ({((analysisResult.hasPriority / analysisResult.totalEntries) * 100).toFixed(2)}%)</p>
                <h3 className="text-lg font-semibold mt-4">Changefreq Analysis:</h3>
                <ul>
                  {Object.entries(analysisResult.changefreqAnalysis).map(([freq, count]) => (
                    <li key={freq}>{freq}: {count} ({((count / analysisResult.totalEntries) * 100).toFixed(2)}%)</li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold mt-4">Priority Analysis:</h3>
                <ul>
                  {Object.entries(analysisResult.priorityAnalysis).map(([priority, count]) => (
                    <li key={priority}>{priority}: {count} ({((count / analysisResult.totalEntries) * 100).toFixed(2)}%)</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No results yet. Please enter a sitemap URL, paste XML content, or upload a file and click &quot;Analyze Sitemap&quot;.</p>
            )}
          </div>
          </div>
      </div>
    </div>
  );
}