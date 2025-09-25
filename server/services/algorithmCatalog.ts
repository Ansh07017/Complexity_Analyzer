export interface AlgorithmCatalogEntry {
  name: string;
  category: string;
  timeComplexityBest: string;
  timeComplexityAverage: string;
  timeComplexityWorst: string;
  spaceComplexity: string;
  description: string;
  learningResources: Array<{
    title: string;
    url: string;
    source: "geeksforgeeks" | "freecodecamp" | "other";
  }>;
  keywords: string[];
}

export const ALGORITHM_CATALOG: AlgorithmCatalogEntry[] = [
  // Sorting Algorithms
  {
    name: "Bubble Sort",
    category: "sorting",
    timeComplexityBest: "O(n)",
    timeComplexityAverage: "O(n²)",
    timeComplexityWorst: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Simple comparison-based sorting algorithm",
    learningResources: [
      {
        title: "Bubble Sort Algorithm",
        url: "https://www.geeksforgeeks.org/bubble-sort/",
        source: "geeksforgeeks"
      },
      {
        title: "Bubble Sort Explained",
        url: "https://www.freecodecamp.org/news/bubble-sort/",
        source: "freecodecamp"
      }
    ],
    keywords: ["bubble", "bubbleSort", "bubble_sort"]
  },
  {
    name: "Quick Sort",
    category: "sorting",
    timeComplexityBest: "O(n log n)",
    timeComplexityAverage: "O(n log n)",
    timeComplexityWorst: "O(n²)",
    spaceComplexity: "O(log n)",
    description: "Efficient divide-and-conquer sorting algorithm",
    learningResources: [
      {
        title: "Quick Sort Algorithm",
        url: "https://www.geeksforgeeks.org/quick-sort/",
        source: "geeksforgeeks"
      },
      {
        title: "Quick Sort Explained",
        url: "https://www.freecodecamp.org/news/quick-sort-algorithm/",
        source: "freecodecamp"
      }
    ],
    keywords: ["quick", "quickSort", "quick_sort"]
  },
  {
    name: "Merge Sort",
    category: "sorting",
    timeComplexityBest: "O(n log n)",
    timeComplexityAverage: "O(n log n)",
    timeComplexityWorst: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Stable divide-and-conquer sorting algorithm",
    learningResources: [
      {
        title: "Merge Sort Algorithm",
        url: "https://www.geeksforgeeks.org/merge-sort/",
        source: "geeksforgeeks"
      },
      {
        title: "Merge Sort Explained",
        url: "https://www.freecodecamp.org/news/merge-sort-algorithm/",
        source: "freecodecamp"
      }
    ],
    keywords: ["merge", "mergeSort", "merge_sort"]
  },
  {
    name: "Heap Sort",
    category: "sorting",
    timeComplexityBest: "O(n log n)",
    timeComplexityAverage: "O(n log n)",
    timeComplexityWorst: "O(n log n)",
    spaceComplexity: "O(1)",
    description: "Comparison-based sorting using heap data structure",
    learningResources: [
      {
        title: "Heap Sort Algorithm",
        url: "https://www.geeksforgeeks.org/heap-sort/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["heap", "heapSort", "heap_sort"]
  },
  {
    name: "Insertion Sort",
    category: "sorting",
    timeComplexityBest: "O(n)",
    timeComplexityAverage: "O(n²)",
    timeComplexityWorst: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Simple sorting algorithm building final array one item at a time",
    learningResources: [
      {
        title: "Insertion Sort Algorithm",
        url: "https://www.geeksforgeeks.org/insertion-sort/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["insertion", "insertionSort", "insertion_sort"]
  },
  {
    name: "Selection Sort",
    category: "sorting",
    timeComplexityBest: "O(n²)",
    timeComplexityAverage: "O(n²)",
    timeComplexityWorst: "O(n²)",
    spaceComplexity: "O(1)",
    description: "In-place comparison sorting algorithm",
    learningResources: [
      {
        title: "Selection Sort Algorithm",
        url: "https://www.geeksforgeeks.org/selection-sort/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["selection", "selectionSort", "selection_sort"]
  },

  // Searching Algorithms
  {
    name: "Binary Search",
    category: "searching",
    timeComplexityBest: "O(1)",
    timeComplexityAverage: "O(log n)",
    timeComplexityWorst: "O(log n)",
    spaceComplexity: "O(1)",
    description: "Efficient search algorithm for sorted arrays",
    learningResources: [
      {
        title: "Binary Search Algorithm",
        url: "https://www.geeksforgeeks.org/binary-search/",
        source: "geeksforgeeks"
      },
      {
        title: "Binary Search Explained",
        url: "https://www.freecodecamp.org/news/binary-search-algorithm/",
        source: "freecodecamp"
      }
    ],
    keywords: ["binary", "binarySearch", "binary_search"]
  },
  {
    name: "Linear Search",
    category: "searching",
    timeComplexityBest: "O(1)",
    timeComplexityAverage: "O(n)",
    timeComplexityWorst: "O(n)",
    spaceComplexity: "O(1)",
    description: "Simple search algorithm checking each element sequentially",
    learningResources: [
      {
        title: "Linear Search Algorithm",
        url: "https://www.geeksforgeeks.org/linear-search/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["linear", "linearSearch", "linear_search", "sequential"]
  },

  // Graph Algorithms
  {
    name: "Breadth-First Search (BFS)",
    category: "graph",
    timeComplexityBest: "O(V + E)",
    timeComplexityAverage: "O(V + E)",
    timeComplexityWorst: "O(V + E)",
    spaceComplexity: "O(V)",
    description: "Graph traversal algorithm exploring vertices level by level",
    learningResources: [
      {
        title: "Breadth First Search Algorithm",
        url: "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/",
        source: "geeksforgeeks"
      },
      {
        title: "BFS Algorithm Explained",
        url: "https://www.freecodecamp.org/news/breadth-first-search-algorithm/",
        source: "freecodecamp"
      }
    ],
    keywords: ["bfs", "breadth", "breadthFirst", "breadth_first"]
  },
  {
    name: "Depth-First Search (DFS)",
    category: "graph",
    timeComplexityBest: "O(V + E)",
    timeComplexityAverage: "O(V + E)",
    timeComplexityWorst: "O(V + E)",
    spaceComplexity: "O(V)",
    description: "Graph traversal algorithm exploring as far as possible before backtracking",
    learningResources: [
      {
        title: "Depth First Search Algorithm",
        url: "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/",
        source: "geeksforgeeks"
      },
      {
        title: "DFS Algorithm Explained",
        url: "https://www.freecodecamp.org/news/depth-first-search-algorithm/",
        source: "freecodecamp"
      }
    ],
    keywords: ["dfs", "depth", "depthFirst", "depth_first"]
  },
  {
    name: "Dijkstra's Algorithm",
    category: "graph",
    timeComplexityBest: "O((V + E) log V)",
    timeComplexityAverage: "O((V + E) log V)",
    timeComplexityWorst: "O((V + E) log V)",
    spaceComplexity: "O(V)",
    description: "Shortest path algorithm for weighted graphs",
    learningResources: [
      {
        title: "Dijkstra's Algorithm",
        url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["dijkstra", "dijkstras", "shortest", "path"]
  },
  {
    name: "Bellman-Ford Algorithm",
    category: "graph",
    timeComplexityBest: "O(VE)",
    timeComplexityAverage: "O(VE)",
    timeComplexityWorst: "O(VE)",
    spaceComplexity: "O(V)",
    description: "Shortest path algorithm that handles negative weights",
    learningResources: [
      {
        title: "Bellman-Ford Algorithm",
        url: "https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["bellman", "ford", "bellmanFord", "bellman_ford"]
  },

  // Dynamic Programming
  {
    name: "Fibonacci (Recursive)",
    category: "dynamic_programming",
    timeComplexityBest: "O(2^n)",
    timeComplexityAverage: "O(2^n)",
    timeComplexityWorst: "O(2^n)",
    spaceComplexity: "O(n)",
    description: "Recursive implementation of Fibonacci sequence",
    learningResources: [
      {
        title: "Fibonacci Series",
        url: "https://www.geeksforgeeks.org/program-for-nth-fibonacci-number/",
        source: "geeksforgeeks"
      },
      {
        title: "Fibonacci Algorithm",
        url: "https://www.freecodecamp.org/news/fibonacci-sequence/",
        source: "freecodecamp"
      }
    ],
    keywords: ["fibonacci", "fib", "recursive"]
  },
  {
    name: "Fibonacci (Dynamic Programming)",
    category: "dynamic_programming",
    timeComplexityBest: "O(n)",
    timeComplexityAverage: "O(n)",
    timeComplexityWorst: "O(n)",
    spaceComplexity: "O(n)",
    description: "Dynamic programming solution for Fibonacci sequence",
    learningResources: [
      {
        title: "Fibonacci Series using DP",
        url: "https://www.geeksforgeeks.org/fibonacci-series-using-dynamic-programming/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["fibonacci", "fib", "dp", "dynamic", "memoization"]
  },
  {
    name: "Knapsack Problem (0/1)",
    category: "dynamic_programming",
    timeComplexityBest: "O(nW)",
    timeComplexityAverage: "O(nW)",
    timeComplexityWorst: "O(nW)",
    spaceComplexity: "O(nW)",
    description: "Classic dynamic programming optimization problem",
    learningResources: [
      {
        title: "0-1 Knapsack Problem",
        url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["knapsack", "dp", "dynamic", "optimization"]
  },
  {
    name: "Longest Common Subsequence",
    category: "dynamic_programming",
    timeComplexityBest: "O(mn)",
    timeComplexityAverage: "O(mn)",
    timeComplexityWorst: "O(mn)",
    spaceComplexity: "O(mn)",
    description: "Finding longest subsequence common to two sequences",
    learningResources: [
      {
        title: "Longest Common Subsequence",
        url: "https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["lcs", "longest", "common", "subsequence"]
  },

  // String Matching
  {
    name: "KMP Algorithm",
    category: "string_matching",
    timeComplexityBest: "O(n + m)",
    timeComplexityAverage: "O(n + m)",
    timeComplexityWorst: "O(n + m)",
    spaceComplexity: "O(m)",
    description: "Efficient string matching algorithm using failure function",
    learningResources: [
      {
        title: "KMP Algorithm",
        url: "https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["kmp", "knuth", "morris", "pratt", "pattern"]
  },
  {
    name: "Rabin-Karp Algorithm",
    category: "string_matching",
    timeComplexityBest: "O(n + m)",
    timeComplexityAverage: "O(n + m)",
    timeComplexityWorst: "O(nm)",
    spaceComplexity: "O(1)",
    description: "String matching using rolling hash",
    learningResources: [
      {
        title: "Rabin-Karp Algorithm",
        url: "https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["rabin", "karp", "rolling", "hash", "pattern"]
  },

  // Greedy Algorithms
  {
    name: "Activity Selection Problem",
    category: "greedy",
    timeComplexityBest: "O(n log n)",
    timeComplexityAverage: "O(n log n)",
    timeComplexityWorst: "O(n log n)",
    spaceComplexity: "O(1)",
    description: "Classic greedy algorithm for scheduling activities",
    learningResources: [
      {
        title: "Activity Selection Problem",
        url: "https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["activity", "selection", "greedy", "scheduling"]
  },
  {
    name: "Huffman Coding",
    category: "greedy",
    timeComplexityBest: "O(n log n)",
    timeComplexityAverage: "O(n log n)",
    timeComplexityWorst: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Optimal prefix-free binary codes using greedy approach",
    learningResources: [
      {
        title: "Huffman Coding Algorithm",
        url: "https://www.geeksforgeeks.org/huffman-coding-greedy-algo-3/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["huffman", "coding", "compression", "greedy"]
  },

  // Advanced/NP-Hard
  {
    name: "Traveling Salesman Problem (Brute Force)",
    category: "np_hard",
    timeComplexityBest: "O(n!)",
    timeComplexityAverage: "O(n!)",
    timeComplexityWorst: "O(n!)",
    spaceComplexity: "O(n)",
    description: "Brute force solution to TSP",
    learningResources: [
      {
        title: "Traveling Salesman Problem",
        url: "https://www.geeksforgeeks.org/traveling-salesman-problem-tsp-implementation/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["tsp", "traveling", "salesman", "brute", "force"]
  },
  {
    name: "Traveling Salesman Problem (DP)",
    category: "np_hard",
    timeComplexityBest: "O(n² × 2^n)",
    timeComplexityAverage: "O(n² × 2^n)",
    timeComplexityWorst: "O(n² × 2^n)",
    spaceComplexity: "O(n × 2^n)",
    description: "Dynamic programming solution to TSP using bitmask",
    learningResources: [
      {
        title: "TSP using Dynamic Programming",
        url: "https://www.geeksforgeeks.org/travelling-salesman-problem-set-1/",
        source: "geeksforgeeks"
      }
    ],
    keywords: ["tsp", "traveling", "salesman", "dp", "dynamic", "bitmask"]
  }
];

export function detectAlgorithm(code: string): AlgorithmCatalogEntry | null {
  const codeNormalized = code.toLowerCase().replace(/[_\s]/g, '');
  
  for (const algorithm of ALGORITHM_CATALOG) {
    for (const keyword of algorithm.keywords) {
      const keywordNormalized = keyword.toLowerCase().replace(/[_\s]/g, '');
      if (codeNormalized.includes(keywordNormalized)) {
        return algorithm;
      }
    }
  }
  
  return null;
}

export function getAlgorithmsByCategory(category: string): AlgorithmCatalogEntry[] {
  return ALGORITHM_CATALOG.filter(algo => algo.category === category);
}

export function getAllCategories(): string[] {
  const categories = new Set(ALGORITHM_CATALOG.map(algo => algo.category));
  return Array.from(categories);
}