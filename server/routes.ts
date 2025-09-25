import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalysisSchema, updateAnalysisSchema } from "@shared/schema";
import { analyzeCode } from "./services/codeAnalyzer.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all analyses
  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getAllAnalyses();
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analyses" });
    }
  });

  // Get specific analysis
  app.get("/api/analyses/:id", async (req, res) => {
    try {
      const analysis = await storage.getAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analysis" });
    }
  });

  // Create new analysis
  app.post("/api/analyses", async (req, res) => {
    try {
      const validatedData = insertAnalysisSchema.parse(req.body);
      const analysis = await storage.createAnalysis(validatedData);
      
      // Start analysis in background
      analyzeCode(analysis.id);
      
      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create analysis" });
      }
    }
  });

  // Update analysis
  app.patch("/api/analyses/:id", async (req, res) => {
    try {
      const validatedData = updateAnalysisSchema.parse(req.body);
      const analysis = await storage.updateAnalysis(req.params.id, validatedData);
      
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }
      
      res.json(analysis);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to update analysis" });
      }
    }
  });

  // Get sample code
  app.get("/api/samples/:algorithm", async (req, res) => {
    const { algorithm } = req.params;
    const { language = "python" } = req.query;

    const samples = {
      "bubble-sort": {
        python: `# Bubble Sort Algorithm
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Test the algorithm
test_array = [64, 34, 25, 12, 22, 11, 90]
sorted_array = bubble_sort(test_array.copy())
print("Sorted array:", sorted_array)`,
        javascript: `// Bubble Sort Algorithm
function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// Test the algorithm
const testArray = [64, 34, 25, 12, 22, 11, 90];
const sortedArray = bubbleSort([...testArray]);
console.log("Sorted array:", sortedArray);`,
        java: `// Bubble Sort Algorithm
public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    
    public static void main(String[] args) {
        int[] testArray = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(testArray);
        System.out.println("Sorted array: " + Arrays.toString(testArray));
    }
}`,
        cpp: `// Bubble Sort Algorithm
#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> testArray = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(testArray);
    
    cout << "Sorted array: ";
    for (int x : testArray) {
        cout << x << " ";
    }
    cout << endl;
    
    return 0;
}`
      },
      "binary-search": {
        python: `# Binary Search Algorithm
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Test the algorithm
sorted_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
target = 7
result = binary_search(sorted_array, target)
print(f"Target {target} found at index: {result}")`,
        javascript: `// Binary Search Algorithm
function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// Test the algorithm
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const target = 7;
const result = binarySearch(sortedArray, target);
console.log(\`Target \${target} found at index: \${result}\`);`
      },
      "fibonacci": {
        python: `# Fibonacci Algorithm (Recursive)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Test the algorithm
n = 10
for i in range(n):
    print(f"F({i}) = {fibonacci(i)}")`,
        javascript: `// Fibonacci Algorithm (Recursive)
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the algorithm
const n = 10;
for (let i = 0; i < n; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`
      }
    };

    const sample = samples[algorithm as keyof typeof samples];
    if (!sample) {
      return res.status(404).json({ error: "Sample not found" });
    }

    const code = sample[language as keyof typeof sample];
    if (!code) {
      return res.status(404).json({ error: "Language not supported for this sample" });
    }

    res.json({ code });
  });

  const httpServer = createServer(app);
  return httpServer;
}
