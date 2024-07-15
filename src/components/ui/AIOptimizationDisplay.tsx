import React from 'react';
import { Card } from '@/components/ui/card';
import Badge from '@/components/ui/badge';

interface OptimizationSuggestion {
  number: number;
  jsonLd: string;
  explanation: string;
  priority: 'High' | 'Medium' | 'Low';
  justification: string;
}

interface OptimizationData {
  suggestions: OptimizationSuggestion[];
  additionalConsiderations?: string;
}

const priorityColors = {
  High: 'bg-red-500 text-white',
  Medium: 'bg-yellow-500 text-black',
  Low: 'bg-green-500 text-white',
};

const formatAdditionalConsiderations = (text: string): JSX.Element => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
  const formattedLines: JSX.Element[] = [];

  lines.forEach((line, index) => {
    if (line.endsWith(':')) {
      // This is a heading
      formattedLines.push(<h4 key={index} className="font-semibold mt-4 mb-2">{line}</h4>);
    } else if (line.startsWith('-')) {
      // This is a bullet point
      formattedLines.push(<li key={index} className="ml-6">{line.substring(1).trim()}</li>);
    } else {
      // This is regular text
      formattedLines.push(<p key={index} className="mb-2">{line}</p>);
    }
  });

  return <>{formattedLines}</>;
};

const AIOptimizationDisplay: React.FC<{ optimization: string }> = ({ optimization }) => {
  const parseOptimizationData = (content: string): OptimizationData => {
    const parts = content.split('Additional Considerations:');
    const suggestionsContent = parts[0];
    const additionalConsiderations = parts[1] ? parts[1].trim() : undefined;

    const suggestions = suggestionsContent.split('Suggestion #').slice(1).map((suggestion, index) => {
      const [jsonLd, rest] = suggestion.split('Explanation:');
      const [explanation, priorityAndJustification] = rest.split('Priority:');
      const [priority, justification] = priorityAndJustification.split('Justification:');
      
      return {
        number: index + 1,
        jsonLd: jsonLd.trim(),
        explanation: explanation.trim(),
        priority: priority.trim() as 'High' | 'Medium' | 'Low',
        justification: justification.trim(),
      };
    });

    return { suggestions, additionalConsiderations };
  };

  const { suggestions, additionalConsiderations } = parseOptimizationData(optimization);

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.number} className="p-4">
          <div className="flex flex-row items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Suggestion #{suggestion.number}</h3>
            <Badge className={priorityColors[suggestion.priority]}>
              {suggestion.priority} Priority
            </Badge>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">JSON-LD Snippet:</h4>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              {suggestion.jsonLd}
            </pre>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Explanation:</h4>
            <p>{suggestion.explanation}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Justification:</h4>
            <p>{suggestion.justification}</p>
          </div>
        </Card>
      ))}
      {additionalConsiderations && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Additional Considerations</h3>
          {formatAdditionalConsiderations(additionalConsiderations)}
        </Card>
      )}
    </div>
  );
};

export default AIOptimizationDisplay;