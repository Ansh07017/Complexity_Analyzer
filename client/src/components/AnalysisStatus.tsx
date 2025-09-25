import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart3, CheckCircle, Clock, XCircle, AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { LoadingSkeleton, InlineLoader } from "@/components/LoadingSkeleton";
import type { Analysis } from "@shared/schema";

interface AnalysisStatusProps {
  analysis?: Analysis;
  isLoading: boolean;
  isRefetching?: boolean;
  error?: any;
  onRetry?: () => void;
}

export default function AnalysisStatus({ 
  analysis, 
  isLoading, 
  isRefetching = false, 
  error,
  onRetry 
}: AnalysisStatusProps) {
  const getStatusInfo = () => {
    if (!analysis) {
      return {
        steps: [
          { name: "Code Validation", status: "pending" },
          { name: "Sandbox Execution", status: "pending" },
          { name: "Complexity Analysis", status: "pending" },
          { name: "Report Generation", status: "pending" },
        ],
        progress: 0,
      };
    }

    switch (analysis.status) {
      case "pending":
        return {
          steps: [
            { name: "Code Validation", status: "complete" },
            { name: "Sandbox Execution", status: "pending" },
            { name: "Complexity Analysis", status: "pending" },
            { name: "Report Generation", status: "pending" },
          ],
          progress: 25,
        };
      case "running":
        return {
          steps: [
            { name: "Code Validation", status: "complete" },
            { name: "Sandbox Execution", status: "running" },
            { name: "Complexity Analysis", status: "pending" },
            { name: "Report Generation", status: "pending" },
          ],
          progress: 50,
        };
      case "completed":
        return {
          steps: [
            { name: "Code Validation", status: "complete" },
            { name: "Sandbox Execution", status: "complete" },
            { name: "Complexity Analysis", status: "complete" },
            { name: "Report Generation", status: "complete" },
          ],
          progress: 100,
        };
      case "error":
        return {
          steps: [
            { name: "Code Validation", status: "complete" },
            { name: "Sandbox Execution", status: "error" },
            { name: "Complexity Analysis", status: "pending" },
            { name: "Report Generation", status: "pending" },
          ],
          progress: 25,
        };
      default:
        return {
          steps: [
            { name: "Code Validation", status: "pending" },
            { name: "Sandbox Execution", status: "pending" },
            { name: "Complexity Analysis", status: "pending" },
            { name: "Report Generation", status: "pending" },
          ],
          progress: 0,
        };
    }
  };

  const { steps, progress } = getStatusInfo();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "running":
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return (
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
            ✓ Complete
          </div>
        );
      case "running":
        return (
          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
            ⏳ Running
          </div>
        );
      case "error":
        return (
          <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
            ✗ Error
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
            ⏸ Pending
          </div>
        );
    }
  };

  // Show loading skeleton when initially loading
  if (isLoading && !analysis) {
    return <LoadingSkeleton variant="status" />;
  }

  // Show error state
  if (error && !analysis) {
    return (
      <Card data-testid="analysis-status-error" className="border-destructive">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-destructive">
                Failed to load analysis
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {error?.message || "An error occurred while fetching analysis data"}
              </p>
            </div>
            {onRetry && (
              <Button
                onClick={onRetry}
                size="sm"
                variant="outline"
                data-testid="button-retry-analysis"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card data-testid="analysis-status">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Analysis Status</span>
            </div>
            {/* Show network/refetching indicators */}
            <div className="flex items-center space-x-2">
              {isRefetching && (
                <div className="flex items-center space-x-1" data-testid="refetching-indicator">
                  <Clock className="w-3 h-3 animate-spin text-blue-500" />
                  <span className="text-xs text-blue-600">Updating...</span>
                </div>
              )}
              {navigator.onLine ? (
                <Wifi className="w-3 h-3 text-green-500" data-testid="online-indicator" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-500" data-testid="offline-indicator" />
              )}
            </div>
          </h3>
          
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(step.status)}
                  <span className="text-sm text-muted-foreground">{step.name}</span>
                </div>
                {getStatusBadge(step.status)}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                Analysis Progress: <span data-testid="progress-percentage">{progress}%</span>
              </p>
              {analysis?.status === "running" && (
                <InlineLoader size="sm" />
              )}
            </div>
            
            {/* Show estimated time for long-running analyses */}
            {analysis?.status === "running" && (
              <div className="mt-2 text-xs text-muted-foreground">
                <span>Estimated time: 30-60 seconds</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Results Summary */}
      {analysis && analysis.status === "completed" && (
        <Card data-testid="quick-results">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Quick Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Time Complexity</span>
                <span className="font-mono text-sm font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {analysis.timeComplexityAverage || analysis.timeComplexityWorst || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Space Complexity</span>
                <span className="font-mono text-sm font-medium bg-green-50 text-green-700 px-2 py-1 rounded">
                  {analysis.spaceComplexity || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Algorithm Type</span>
                <span className="text-sm text-foreground">
                  {analysis.algorithmType || "Unknown"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
