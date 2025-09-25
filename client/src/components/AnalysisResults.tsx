import { Card, CardContent } from "@/components/ui/card";
import { Zap, MemoryStick } from "lucide-react";
import type { Analysis, ExecutionResultType } from "@shared/schema";
import { isExecutionResultArray } from "@shared/schema";

interface AnalysisResultsProps {
  analysis: Analysis;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const executionResults: ExecutionResultType[] = isExecutionResultArray(analysis.executionResults) 
    ? analysis.executionResults 
    : [];
  const successfulResults = executionResults.filter(r => r.status === "success");

  return (
    <Card data-testid="analysis-results">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold">Complexity Analysis</h3>
      </div>
      <CardContent className="p-4 space-y-4">
        {/* Time Complexity */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Time Complexity</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Best Case:</span>
              <span className="font-mono text-sm font-semibold text-blue-900">
                {analysis.timeComplexityBest || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Average Case:</span>
              <span className="font-mono text-sm font-semibold text-blue-900">
                {analysis.timeComplexityAverage || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Worst Case:</span>
              <span className="font-mono text-lg font-semibold text-blue-900">
                {analysis.timeComplexityWorst || "Unable to determine"}
              </span>
            </div>
          </div>
          <p className="text-blue-600 text-sm mt-3">
            {getComplexityDescription(analysis.timeComplexityWorst || undefined)}
          </p>
        </div>

        {/* Space Complexity */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MemoryStick className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Space Complexity</span>
          </div>
          <p className="text-green-700 font-mono text-lg font-semibold">
            {analysis.spaceComplexity || "Unable to determine"}
          </p>
          <p className="text-green-600 text-sm mt-1">
            {getComplexityDescription(analysis.spaceComplexity || undefined)}
          </p>
        </div>

        {/* Test Results */}
        {successfulResults.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Test Results</h4>
            <div className="space-y-2">
              {successfulResults.slice(0, 5).map((result, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span data-testid={`test-result-size-${index}`}>n = {result.inputSize.toLocaleString()}</span>
                  <span className="font-mono" data-testid={`test-result-time-${index}`}>
                    {result.runtime.toFixed(4)}s
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Algorithm Details */}
        {(analysis.algorithmName || analysis.algorithmCategory || analysis.algorithmType) && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Algorithm Details</h4>
            <div className="space-y-2">
              {analysis.algorithmName && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Algorithm:</span>
                  <span className="text-sm font-medium">{analysis.algorithmName}</span>
                </div>
              )}
              {analysis.algorithmCategory && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="text-sm font-medium capitalize">{analysis.algorithmCategory.replace('_', ' ')}</span>
                </div>
              )}
              {analysis.algorithmType && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm font-medium">{analysis.algorithmType}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getComplexityDescription(complexity?: string): string {
  if (!complexity) return "Analysis pending or failed";
  
  switch (complexity) {
    case "O(1)":
      return "Constant time - performance doesn't change with input size";
    case "O(log n)":
      return "Logarithmic time - efficient for large inputs";
    case "O(n)":
      return "Linear time - performance scales proportionally with input";
    case "O(n log n)":
      return "Linearithmic time - good for sorting algorithms";
    case "O(n²)":
      return "Quadratic time - performance degrades significantly with larger inputs";
    case "O(n³) or higher":
      return "Cubic or higher - very inefficient for large inputs";
    default:
      return "Performance characteristics determined by analysis";
  }
}
