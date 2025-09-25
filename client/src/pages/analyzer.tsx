import { useState, useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient, createQueryKey, cacheUtils } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Trash2, Zap, Menu, BookOpen, Download, FileJson, Clock, AlertCircle, Wifi, WifiOff } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import AnalysisStatus from "@/components/AnalysisStatus";
import ComplexityCharts from "@/components/ComplexityCharts";
import AnalysisResults from "@/components/AnalysisResults";
import RecommendationsPanel from "@/components/RecommendationsPanel";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import type { Analysis, InsertAnalysis, AnalysisChartData, AnalysisWarningType, RecommendationType, LearningResourceType } from "@shared/schema";
import { isAnalysisChartData } from "@shared/schema";

// Type guard to check if analysis is complete
function isCompleteAnalysis(analysis: Analysis | undefined): analysis is Analysis {
  return !!analysis && analysis.status === "completed";
}

// Type guard to check if analysis is running
function isRunningAnalysis(analysis: Analysis | undefined): analysis is Analysis {
  return !!analysis && analysis.status === "running";
}

export default function Analyzer() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [maxInputSize, setMaxInputSize] = useState(10000);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch current analysis with optimized polling
  const { 
    data: currentAnalysis, 
    isLoading: analysisLoading,
    error: analysisError,
    isFetching: analysisRefetching
  } = useQuery({
    queryKey: createQueryKey.analysis(currentAnalysisId || undefined),
    enabled: !!currentAnalysisId,
    staleTime: 30 * 1000, // 30 seconds - analysis data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    refetchInterval: (query) => {
      const data = query.state.data as Analysis | undefined;
      // More intelligent polling - faster for running tasks, slower for pending
      if (data?.status === "running") {
        return 1000; // 1 second for running analysis
      } else if (data?.status === "pending") {
        return 3000; // 3 seconds for pending analysis
      }
      return false; // Stop polling for completed/error states
    },
    // Stop refetching on window focus for active polling queries
    refetchOnWindowFocus: (query) => {
      const data = query.state.data as Analysis | undefined;
      return !data || (data.status !== "pending" && data.status !== "running");
    },
    // Retry configuration for analysis queries
    retry: (failureCount, error: any) => {
      // Don't retry if analysis is not found (404)
      if (error?.status === 404) return false;
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });

  // Create analysis mutation with optimistic updates
  const createAnalysisMutation = useMutation({
    mutationFn: async (analysisData: InsertAnalysis) => {
      const response = await apiRequest("POST", "/api/analyses", analysisData, {
        timeout: 45000 // Longer timeout for analysis creation
      });
      return response.json();
    },
    onMutate: async (analysisData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: createQueryKey.analysis() });
      
      // Optimistic update - show pending state immediately
      const optimisticAnalysis: Partial<Analysis> = {
        id: `temp-${Date.now()}`,
        code: analysisData.code,
        language: analysisData.language,
        status: "pending",
        timeComplexityWorst: null,
        spaceComplexity: null,
      };
      
      return { optimisticAnalysis };
    },
    onSuccess: (analysis: Analysis) => {
      setCurrentAnalysisId(analysis.id);
      
      // More targeted cache invalidation - only invalidate the list, not individual items
      cacheUtils.invalidateAnalyses();
      
      // Set the new analysis data directly in the cache
      queryClient.setQueryData(createQueryKey.analysis(analysis.id), analysis);
      
      toast({
        title: "Analysis Started",
        description: "Your code is being analyzed for complexity patterns.",
      });
    },
    onError: (error, analysisData, context) => {
      // Revert optimistic update on error
      if (context?.optimisticAnalysis) {
        queryClient.invalidateQueries({ queryKey: createQueryKey.analysis() });
      }
      
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    // Prevent multiple simultaneous analysis creation
    onSettled: () => {
      // Refetch to ensure consistency
      if (currentAnalysisId) {
        queryClient.invalidateQueries({ queryKey: createQueryKey.analysis(currentAnalysisId) });
      }
    },
  });

  // Load sample code with caching
  const loadSampleMutation = useMutation({
    mutationFn: async ({ algorithm, language }: { algorithm: string; language: string }) => {
      // Check cache first
      const cachedData = queryClient.getQueryData(
        createQueryKey.sample(algorithm, language)
      );
      
      if (cachedData) {
        return cachedData;
      }
      
      const response = await apiRequest("GET", `/api/samples/${algorithm}?language=${language}`);
      const data = await response.json();
      
      // Cache the sample data for future use
      queryClient.setQueryData(
        createQueryKey.sample(algorithm, language),
        data,
        {
          updatedAt: Date.now(),
        }
      );
      
      return data;
    },
    onSuccess: (data) => {
      setCode(data.code);
      // Clear current analysis when loading new sample
      setCurrentAnalysisId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to Load Sample",
        description: error.message,
        variant: "destructive",
      });
    },
    // Cache successful sample loads for faster subsequent loads
    gcTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  const handleAnalyzeCode = useCallback(() => {
    if (!code.trim()) {
      toast({
        title: "No Code Provided",
        description: "Please enter some code to analyze.",
        variant: "destructive",
      });
      return;
    }

    createAnalysisMutation.mutate({
      code,
      language,
      maxInputSize,
      status: "pending",
    });
  }, [code, language, maxInputSize, createAnalysisMutation, toast]);

  const handleClearEditor = useCallback(() => {
    setCode("");
    // Clear current analysis and its cache
    if (currentAnalysisId) {
      cacheUtils.removeAnalysis(currentAnalysisId);
    }
    setCurrentAnalysisId(null);
  }, [currentAnalysisId]);

  const loadSample = useCallback((algorithm: string) => {
    loadSampleMutation.mutate({ algorithm, language });
  }, [loadSampleMutation, language]);

  const exportReport = useCallback((format: 'json' | 'pdf') => {
    if (!currentAnalysis) return;
    
    if (format === 'json') {
      const dataStr = JSON.stringify(currentAnalysis, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analysis-${currentAnalysis.id}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      toast({
        title: "PDF Export",
        description: "PDF export functionality would be implemented here.",
      });
    }
  }, [currentAnalysis, toast]);

  return (
    <ErrorBoundary onRetry={() => window.location.reload()}>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-primary-foreground rounded-lg p-2">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Complexity Analyzer</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">History</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Learn</a>
              <Button>Sign In</Button>
            </nav>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium">Language:</Label>
                  <Select value={language} onValueChange={setLanguage} data-testid="select-language">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label className="text-sm font-medium">Max Input Size:</Label>
                  <Input
                    type="number"
                    value={maxInputSize}
                    onChange={(e) => setMaxInputSize(Number(e.target.value))}
                    max={10000000}
                    className="w-24"
                    data-testid="input-max-size"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleClearEditor}
                  data-testid="button-clear"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button
                  onClick={handleAnalyzeCode}
                  disabled={createAnalysisMutation.isPending || !code.trim()}
                  data-testid="button-analyze"
                >
                  {createAnalysisMutation.isPending ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  {createAnalysisMutation.isPending ? 'Starting Analysis...' : 'Analyze Code'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Editor and Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code Editor Panel */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="border-b border-border p-3">
                <h2 className="font-semibold text-foreground">Code Editor</h2>
                <p className="text-sm text-muted-foreground">Write or paste your algorithm code below</p>
              </div>
              <div className="p-1">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  height="400px"
                />
              </div>
              
              {/* Sample Code Snippets */}
              <div className="border-t border-border p-4">
                <p className="text-sm font-medium mb-3">Quick Start Examples:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSample("bubble-sort")}
                    disabled={loadSampleMutation.isPending}
                    data-testid="button-sample-bubble-sort"
                  >
                    Bubble Sort
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSample("binary-search")}
                    disabled={loadSampleMutation.isPending}
                    data-testid="button-sample-binary-search"
                  >
                    Binary Search
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSample("fibonacci")}
                    disabled={loadSampleMutation.isPending}
                    data-testid="button-sample-fibonacci"
                  >
                    Fibonacci
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Analysis Status Panel */}
          <div className="space-y-6">
            <ErrorBoundary onRetry={() => {
              if (currentAnalysisId) {
                queryClient.invalidateQueries({ queryKey: createQueryKey.analysis(currentAnalysisId) });
              }
            }}>
              <AnalysisStatus 
                analysis={currentAnalysis} 
                isLoading={analysisLoading || createAnalysisMutation.isPending}
                isRefetching={analysisRefetching}
                error={analysisError}
                onRetry={() => {
                  if (currentAnalysisId) {
                    queryClient.invalidateQueries({ queryKey: createQueryKey.analysis(currentAnalysisId) });
                  }
                }}
              />
            </ErrorBoundary>

            {/* Sandbox Environment Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <div className="w-5 h-5 bg-orange-500 rounded-full" />
                  <span>Sandbox Info</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment</span>
                    <span>Node.js Sandbox</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPU Limit</span>
                    <span>1 Core</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Memory Limit</span>
                    <span>1 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timeout</span>
                    <span>10 seconds</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Section */}
        {currentAnalysis && (
          <div className="mt-8 space-y-6">
            {/* Performance Charts */}
            {currentAnalysis?.chartData && isAnalysisChartData(currentAnalysis.chartData) ? (
              <ComplexityCharts chartData={currentAnalysis.chartData} />
            ) : (
              isRunningAnalysis(currentAnalysis) && (
                <LoadingSkeleton variant="chart" />
              )
            )}

            {/* Detailed Analysis Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {isCompleteAnalysis(currentAnalysis) ? (
                <AnalysisResults analysis={currentAnalysis} />
              ) : (
                <LoadingSkeleton variant="results" />
              )}
              
              {isCompleteAnalysis(currentAnalysis) ? (
                <RecommendationsPanel 
                  warnings={currentAnalysis.warnings as AnalysisWarningType[] | null}
                  recommendations={currentAnalysis.recommendations as RecommendationType[] | null}
                  learningResources={currentAnalysis.learningResources as LearningResourceType[] | null}
                />
              ) : (
                <LoadingSkeleton variant="results" />
              )}
            </div>

            {/* Report Generation */}
            {isCompleteAnalysis(currentAnalysis) && (
              <Card>
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold">Export Report</h3>
                  <p className="text-sm text-muted-foreground">Download your complexity analysis in multiple formats</p>
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-ring" />
                        <span className="text-sm">Include source code</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-ring" />
                        <span className="text-sm">Include charts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-border text-primary focus:ring-ring" />
                        <span className="text-sm">Include learning resources</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => exportReport('json')}
                        data-testid="button-export-json"
                      >
                        <FileJson className="w-4 h-4 mr-2" />
                        Export JSON
                      </Button>
                      <Button
                        onClick={() => exportReport('pdf')}
                        data-testid="button-export-pdf"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
      </div>
    </ErrorBoundary>
  );
}
