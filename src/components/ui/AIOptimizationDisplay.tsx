import React from 'react';
import { Card } from '@/components/ui/card';
import Badge from '@/components/ui/badge';

interface OptimizationSection {
  title: string;
  content: string;
  priority?: 'High' | 'Medium' | 'Low';
}

const priorityColors = {
  High: 'bg-red-500 text-white',
  Medium: 'bg-yellow-500 text-black',
  Low: 'bg-green-500 text-white',
};

const AIOptimizationDisplay: React.FC<{ optimization: string }> = ({ optimization }) => {
  const parseOptimizationData = (content: string): OptimizationSection[] => {
    if (!content) {
      console.error('Empty content received in parseOptimizationData');
      return [];
    }

    const sections: OptimizationSection[] = [];
    const lines = content.split('\n');
    let currentSection: OptimizationSection | null = null;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('Suggestion #') || trimmedLine === 'Additional Considerations:') {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: trimmedLine,
          content: '',
          priority: undefined,
        };
      } else if (currentSection) {
        if (trimmedLine.startsWith('Priority:')) {
          currentSection.priority = getPriority(trimmedLine);
        } else {
          currentSection.content += line + '\n';
        }
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const getPriority = (line: string): 'High' | 'Medium' | 'Low' | undefined => {
    const priorityMatch = line.match(/Priority:\s*(High|Medium|Low)/i);
    return priorityMatch ? (priorityMatch[1] as 'High' | 'Medium' | 'Low') : undefined;
  };

  const formatContent = (content: string): JSX.Element => {
    const parts = content.split(/(```(?:json)?(?:\n(?:[\s\S]*?)\n)?```)/);
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            // This is a code block
            const code = part.replace(/```(json)?\n?/, '').replace(/\n?```$/, '');
            return (
              <pre key={index} className="bg-gray-100 p-2 rounded overflow-x-auto my-2">
                <code>{code}</code>
              </pre>
            );
          } else {
            // This is regular text
            return (
              <div key={index}>
                {part.split('\n').map((line, lineIndex) => {
                  const trimmedLine = line.trim();
                  if (trimmedLine.endsWith(':') && !trimmedLine.includes(':http')) {
                    return <h4 key={lineIndex} className="font-semibold mt-4 mb-2">{line}</h4>;
                  } else {
                    return <p key={lineIndex} className="mb-2">{line}</p>;
                  }
                })}
              </div>
            );
          }
        })}
      </>
    );
  };

  const sections = parseOptimizationData(optimization);

  if (sections.length === 0) {
    return <div>No optimization suggestions available.</div>;
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <Card key={index} className="p-4">
          <div className="flex flex-row items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{section.title}</h3>
            {section.priority && (
              <Badge className={priorityColors[section.priority]}>
                {section.priority} Priority
              </Badge>
            )}
          </div>
          <div className="prose max-w-none">
            {formatContent(section.content)}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AIOptimizationDisplay;