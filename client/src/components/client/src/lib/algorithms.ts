import { AlgorithmStep, ComplexityLevel } from "@/types/algorithm";

export function getComplexityLevel(complexity: string): ComplexityLevel {
  if (complexity.includes("O(1)") || complexity.includes("O(log n)")) {
    return "excellent";
  }
  if (complexity.includes("O(n)") || complexity.includes("O(n log n)")) {
    return "good";
  }
  if (complexity.includes("O(n²)") || complexity.includes("O(V + E)")) {
    return "fair";
  }
  return "poor";
}

export function getComplexityColor(level: ComplexityLevel): string {
  switch (level) {
    case "excellent":
      return "complexity-excellent";
    case "good":
      return "complexity-good";
    case "fair":
      return "complexity-fair";
    case "poor":
      return "complexity-poor";
    default:
      return "complexity-fair";
  }
}

export function generateRandomArray(size: number, min: number = 1, max: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function generateSortedArray(size: number, min: number = 1, max: number = 100): number[] {
  const step = (max - min) / (size - 1);
  return Array.from({ length: size }, (_, i) => Math.floor(min + i * step));
}

export async function* bubbleSort(arr: number[]): AsyncGenerator<AlgorithmStep> {
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;
  
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisons++;
      
      yield {
        id: comparisons,
        description: `Comparing elements at positions ${j} and ${j + 1}`,
        highlight: [j, j + 1],
        metrics: { comparisons, swaps, timeComplexity: "O(n²)" }
      };
      
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        
        yield {
          id: comparisons + 0.5,
          description: `Swapping elements ${array[j + 1]} and ${array[j]}`,
          highlight: [j, j + 1],
          metrics: { comparisons, swaps, timeComplexity: "O(n²)" }
        };
      }
    }
  }
  
  yield {
    id: comparisons + 1,
    description: "Array is now sorted!",
    highlight: [],
    metrics: { comparisons, swaps, timeComplexity: "O(n²)" }
  };
}

export async function* binarySearch(arr: number[], target: number): AsyncGenerator<AlgorithmStep> {
  let left = 0;
  let right = arr.length - 1;
  let comparisons = 0;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;
    
    yield {
      id: comparisons,
      description: `Checking middle element at index ${mid} (value: ${arr[mid]})`,
      highlight: [mid],
      metrics: { comparisons, timeComplexity: "O(log n)" }
    };
    
    if (arr[mid] === target) {
      yield {
        id: comparisons + 0.5,
        description: `Found target ${target} at index ${mid}!`,
        highlight: [mid],
        metrics: { comparisons, timeComplexity: "O(log n)" }
      };
      return;
    }
    
    if (arr[mid] < target) {
      left = mid + 1;
      yield {
        id: comparisons + 0.3,
        description: `Target is greater than ${arr[mid]}, searching right half`,
        highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        metrics: { comparisons, timeComplexity: "O(log n)" }
      };
    } else {
      right = mid - 1;
      yield {
        id: comparisons + 0.3,
        description: `Target is less than ${arr[mid]}, searching left half`,
        highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        metrics: { comparisons, timeComplexity: "O(log n)" }
      };
    }
  }
  
  yield {
    id: comparisons + 1,
    description: `Target ${target} not found in array`,
    highlight: [],
    metrics: { comparisons, timeComplexity: "O(log n)" }
  };
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case "sorting":
      return "fas fa-sort-amount-down";
    case "searching":
      return "fas fa-search";
    case "graph":
      return "fas fa-project-diagram";
    case "dynamic-programming":
      return "fas fa-code-branch";
    default:
      return "fas fa-cog";
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case "sorting":
      return "bg-green-100";
    case "searching":
      return "bg-blue-100";
    case "graph":
      return "bg-purple-100";
    case "dynamic-programming":
      return "bg-orange-100";
    default:
      return "bg-gray-100";
  }
}
