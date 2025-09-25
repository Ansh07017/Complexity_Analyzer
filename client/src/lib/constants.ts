export const SUPPORTED_LANGUAGES = [
  { value: "python", label: "Python", fileExtension: ".py" },
  { value: "javascript", label: "JavaScript", fileExtension: ".js" },
  { value: "java", label: "Java", fileExtension: ".java" },
  { value: "cpp", label: "C++", fileExtension: ".cpp" },
] as const;

export const MAX_INPUT_SIZE = 10000000;
export const DEFAULT_MAX_INPUT_SIZE = 10000;
export const EXECUTION_TIMEOUT = 10000; // 10 seconds

export const COMPLEXITY_DESCRIPTIONS = {
  "O(1)": "Constant time - performance doesn't change with input size",
  "O(log n)": "Logarithmic time - efficient for large inputs",
  "O(n)": "Linear time - performance scales proportionally with input",
  "O(n log n)": "Linearithmic time - good for sorting algorithms", 
  "O(n²)": "Quadratic time - performance degrades significantly with larger inputs",
  "O(n³)": "Cubic time - very inefficient for large inputs",
  "O(2^n)": "Exponential time - impractical for moderate to large inputs",
} as const;

export const SAMPLE_ALGORITHMS = [
  { key: "bubble-sort", label: "Bubble Sort", complexity: "O(n²)" },
  { key: "binary-search", label: "Binary Search", complexity: "O(log n)" },
  { key: "fibonacci", label: "Fibonacci", complexity: "O(2^n)" },
  { key: "linear-search", label: "Linear Search", complexity: "O(n)" },
] as const;

export const LEARNING_RESOURCES = {
  GEEKSFORGEEKS: {
    name: "GeeksforGeeks",
    baseUrl: "https://www.geeksforgeeks.org",
    color: "bg-green-500",
  },
  FREECODECAMP: {
    name: "FreeCodeCamp", 
    baseUrl: "https://www.freecodecamp.org",
    color: "bg-blue-500",
  },
} as const;
