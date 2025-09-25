import { storage } from "../storage";
import { SandboxExecutor } from "./sandboxExecutor";
import { detectAlgorithm, ALGORITHM_CATALOG } from "./algorithmCatalog";
import type { 
  ExecutionResultType, 
  ComplexityAnalysisType, 
  AnalysisWarningType, 
  RecommendationType,
  LearningResourceType 
} from "@shared/schema";

export class CodeAnalyzer {
  private static readonly INPUT_SIZES = [100, 500, 1000, 2000, 5000];
  private static readonly MAX_INPUT_SIZE = 10000;

  static async analyzeComplexity(analysisId: string): Promise<void> {
    try {
      const analysis = await storage.getAnalysis(analysisId);
      if (!analysis) {
        throw new Error("Analysis not found");
      }

      // Update status to running
      await storage.updateAnalysis(analysisId, { status: "running" });

      // Execute code with different input sizes using parallel execution for better performance
      const inputSizes = this.INPUT_SIZES.filter(size => size <= analysis.maxInputSize);
      const results = await SandboxExecutor.executeCodeParallel(
        analysis.code,
        analysis.language,
        inputSizes,
        10000
      );

      // Analyze complexity patterns
      const complexityAnalysis = this.detectComplexity(results, analysis.code);
      const warnings = this.generateWarnings(results, complexityAnalysis);
      const recommendations = this.generateRecommendations(complexityAnalysis, analysis.language);
      const learningResources = this.getLearningResources(complexityAnalysis.algorithmCategory, complexityAnalysis.algorithmName);
      const chartData = this.generateChartData(results);

      // Update analysis with results
      await storage.updateAnalysis(analysisId, {
        status: "completed",
        timeComplexityBest: complexityAnalysis.timeComplexityBest,
        timeComplexityAverage: complexityAnalysis.timeComplexityAverage,
        timeComplexityWorst: complexityAnalysis.timeComplexityWorst,
        spaceComplexity: complexityAnalysis.spaceComplexity,
        algorithmName: complexityAnalysis.algorithmName,
        algorithmCategory: complexityAnalysis.algorithmCategory,
        algorithmType: complexityAnalysis.algorithmType,
        executionResults: results,
        warnings,
        recommendations,
        learningResources,
        chartData,
      });

    } catch (error) {
      await storage.updateAnalysis(analysisId, { 
        status: "error",
        warnings: [{
          type: "error",
          message: error instanceof Error ? error.message : "Analysis failed",
          severity: "high"
        }]
      });
    }
  }

  private static detectComplexity(results: ExecutionResultType[], code: string): ComplexityAnalysisType {
    const successfulResults = results.filter(r => r.status === "success");
    
    // Try to detect algorithm from catalog first
    const detectedAlgorithm = detectAlgorithm(code);
    
    if (detectedAlgorithm) {
      return {
        timeComplexityBest: detectedAlgorithm.timeComplexityBest,
        timeComplexityAverage: detectedAlgorithm.timeComplexityAverage,
        timeComplexityWorst: detectedAlgorithm.timeComplexityWorst,
        spaceComplexity: detectedAlgorithm.spaceComplexity,
        confidence: 0.9,
        algorithmName: detectedAlgorithm.name,
        algorithmCategory: detectedAlgorithm.category,
        algorithmType: detectedAlgorithm.name,
        testResults: results,
      };
    }
    
    if (successfulResults.length < 2) {
      return {
        timeComplexityBest: "Unable to determine",
        timeComplexityAverage: "Unable to determine",
        timeComplexityWorst: "Unable to determine",
        spaceComplexity: "Unable to determine",
        confidence: 0,
        testResults: results,
      };
    }

    // Fallback to empirical analysis
    const empiricalComplexity = this.detectTimeComplexity(successfulResults);
    const spaceComplexity = this.detectSpaceComplexity(successfulResults);

    return {
      timeComplexityBest: empiricalComplexity,
      timeComplexityAverage: empiricalComplexity,
      timeComplexityWorst: empiricalComplexity,
      spaceComplexity,
      confidence: 0.6,
      algorithmType: "Unknown Algorithm",
      testResults: results,
    };
  }

  private static detectTimeComplexity(results: ExecutionResultType[]): string {
    if (results.length < 2) return "Unable to determine";

    // Calculate growth ratios
    const ratios: number[] = [];
    for (let i = 1; i < results.length; i++) {
      const prevResult = results[i - 1];
      const currResult = results[i];
      
      if (prevResult.runtime > 0) {
        const sizeRatio = currResult.inputSize / prevResult.inputSize;
        const timeRatio = currResult.runtime / prevResult.runtime;
        ratios.push(timeRatio / sizeRatio);
      }
    }

    const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;

    // Simple heuristics for complexity detection
    if (avgRatio < 1.5) return "O(1)";
    if (avgRatio < 3) return "O(log n)";
    if (avgRatio < 5) return "O(n)";
    if (avgRatio < 10) return "O(n log n)";
    if (avgRatio < 20) return "O(n²)";
    return "O(n³) or higher";
  }

  private static detectSpaceComplexity(results: ExecutionResultType[]): string {
    // Simplified space complexity detection
    const memoryGrowth = results.map(r => r.memoryUsage / r.inputSize);
    const avgGrowth = memoryGrowth.reduce((a, b) => a + b, 0) / memoryGrowth.length;

    if (avgGrowth < 0.1) return "O(1)";
    if (avgGrowth < 1) return "O(log n)";
    return "O(n)";
  }

  private static detectAlgorithmType(timeComplexity: string, results: ExecutionResultType[]): string {
    // Simple algorithm detection based on complexity patterns
    switch (timeComplexity) {
      case "O(n²)":
        return "Bubble Sort";
      case "O(n log n)":
        return "Merge Sort";
      case "O(log n)":
        return "Binary Search";
      case "O(n)":
        return "Linear Search";
      default:
        return "Unknown Algorithm";
    }
  }

  private static generateWarnings(
    results: ExecutionResultType[], 
    analysis: ComplexityAnalysisType
  ): AnalysisWarningType[] {
    const warnings: AnalysisWarningType[] = [];

    // Check for timeouts
    const timeouts = results.filter(r => r.status === "timeout");
    if (timeouts.length > 0) {
      warnings.push({
        type: "timeout",
        message: `Execution timed out for input sizes: ${timeouts.map(r => r.inputSize).join(", ")}`,
        severity: "high",
      });
    }

    // Check for errors
    const errors = results.filter(r => r.status === "error");
    if (errors.length > 0) {
      warnings.push({
        type: "error",
        message: `Execution failed for input sizes: ${errors.map(r => r.inputSize).join(", ")}`,
        severity: "high",
      });
    }

    // Performance warnings
    if (analysis.timeComplexityWorst === "O(n²)" || analysis.timeComplexityWorst === "O(n³) or higher" || analysis.timeComplexityWorst?.includes("!")) {
      warnings.push({
        type: "performance",
        message: "Algorithm has poor time complexity and may not scale well with large inputs",
        severity: "medium",
      });
    }

    // Memory warnings
    const highMemoryUsage = results.some(r => r.memoryUsage > 500);
    if (highMemoryUsage) {
      warnings.push({
        type: "memory",
        message: "High memory usage detected - consider optimizing space complexity",
        severity: "medium",
      });
    }

    return warnings;
  }

  private static generateRecommendations(
    analysis: ComplexityAnalysisType, 
    language: string
  ): RecommendationType[] {
    const recommendations: RecommendationType[] = [];

    // Time complexity recommendations
    if (analysis.timeComplexityWorst === "O(n²)" && analysis.algorithmCategory === "sorting") {
      recommendations.push({
        type: "optimization",
        title: "Consider using more efficient sorting algorithms",
        description: "Replace with Merge Sort or Quick Sort for O(n log n) time complexity",
        links: [
          "https://www.geeksforgeeks.org/merge-sort/",
          "https://www.geeksforgeeks.org/quick-sort/"
        ],
      });
    }

    // Language-specific recommendations
    if (language === "python") {
      recommendations.push({
        type: "optimization",
        title: "Use built-in functions when possible",
        description: "Python's built-in sorted() function is highly optimized",
      });
    }

    // Learning recommendations
    recommendations.push({
      type: "learning",
      title: "Learn about algorithm complexity",
      description: "Understanding Big O notation will help you write more efficient code",
      links: [
        "https://www.freecodecamp.org/news/big-o-notation/",
        "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/"
      ],
    });

    return recommendations;
  }

  private static getLearningResources(algorithmCategory?: string, algorithmName?: string): LearningResourceType[] {
    const resources: LearningResourceType[] = [
      {
        title: "Big O Notation Explained",
        url: "https://www.freecodecamp.org/news/big-o-notation/",
        source: "freecodecamp",
        description: "Complete guide to understanding algorithm complexity",
      },
      {
        title: "Analysis of Algorithms",
        url: "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/",
        source: "geeksforgeeks",
        description: "Asymptotic analysis and complexity theory",
      },
    ];

    // Add algorithm-specific resources from catalog
    if (algorithmName) {
      const catalogEntry = ALGORITHM_CATALOG.find(algo => algo.name === algorithmName);
      if (catalogEntry) {
        resources.push(...catalogEntry.learningResources.map(resource => ({
          title: resource.title,
          url: resource.url,
          source: resource.source,
          description: catalogEntry.description,
        })));
      }
    }

    // Add category-specific resources
    if (algorithmCategory === "sorting") {
      resources.push({
        title: "Sorting Algorithms",
        url: "https://www.geeksforgeeks.org/sorting-algorithms/",
        source: "geeksforgeeks",
        description: "Comprehensive guide to sorting algorithms",
      });
    }

    if (algorithmCategory === "searching") {
      resources.push({
        title: "Searching Algorithms",
        url: "https://www.geeksforgeeks.org/searching-algorithms/",
        source: "geeksforgeeks",
        description: "Different searching techniques and their complexities",
      });
    }

    if (algorithmCategory === "graph") {
      resources.push({
        title: "Graph Algorithms",
        url: "https://www.geeksforgeeks.org/graph-algorithms/",
        source: "geeksforgeeks",
        description: "Graph traversal and shortest path algorithms",
      });
    }

    if (algorithmCategory === "dynamic_programming") {
      resources.push({
        title: "Dynamic Programming",
        url: "https://www.geeksforgeeks.org/dynamic-programming/",
        source: "geeksforgeeks",
        description: "Dynamic programming concepts and problems",
      });
    }

    return resources;
  }

  private static generateChartData(results: ExecutionResultType[]) {
    const successfulResults = results.filter(r => r.status === "success");
    
    return {
      runtime: {
        labels: successfulResults.map(r => r.inputSize.toString()),
        datasets: [
          {
            label: "Actual Runtime",
            data: successfulResults.map(r => r.runtime),
            borderColor: "hsl(221 83% 53%)",
            backgroundColor: "hsla(221 83% 53% / 0.1)",
          }
        ]
      },
      memory: {
        labels: successfulResults.map(r => r.inputSize.toString()),
        datasets: [
          {
            label: "Memory Usage",
            data: successfulResults.map(r => r.memoryUsage),
            borderColor: "hsl(142 76% 36%)",
            backgroundColor: "hsla(142 76% 36% / 0.1)",
          }
        ]
      }
    };
  }
}

// Background analysis function
export async function analyzeCode(analysisId: string): Promise<void> {
  // Run analysis in background
  setTimeout(() => {
    CodeAnalyzer.analyzeComplexity(analysisId);
  }, 100);
}
