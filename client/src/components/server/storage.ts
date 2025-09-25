import { type Algorithm, type InsertAlgorithm, type AlgorithmSession, type InsertAlgorithmSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Algorithm methods
  getAlgorithm(id: string): Promise<Algorithm | undefined>;
  getAlgorithmsByCategory(category: string): Promise<Algorithm[]>;
  getAllAlgorithms(): Promise<Algorithm[]>;
  createAlgorithm(algorithm: InsertAlgorithm): Promise<Algorithm>;
  updateAlgorithm(id: string, algorithm: Partial<Algorithm>): Promise<Algorithm | undefined>;
  
  // Session methods
  getAlgorithmSession(id: string): Promise<AlgorithmSession | undefined>;
  createAlgorithmSession(session: InsertAlgorithmSession): Promise<AlgorithmSession>;
  updateAlgorithmSession(id: string, session: Partial<AlgorithmSession>): Promise<AlgorithmSession | undefined>;
  getSessionsByUser(userId: string): Promise<AlgorithmSession[]>;
}

export class MemStorage implements IStorage {
  private algorithms: Map<string, Algorithm>;
  private sessions: Map<string, AlgorithmSession>;

  constructor() {
    this.algorithms = new Map();
    this.sessions = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed with default algorithms
    const defaultAlgorithms: InsertAlgorithm[] = [
      {
        name: "Quick Sort",
        category: "sorting",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(log n)",
        description: "Divide-and-conquer sorting algorithm that picks a pivot and partitions the array",
        steps: ["Choose pivot", "Partition array", "Recursively sort subarrays"],
        isPopular: true,
      },
      {
        name: "Merge Sort",
        category: "sorting",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        description: "Stable divide-and-conquer sorting algorithm",
        steps: ["Divide array", "Sort subarrays", "Merge sorted subarrays"],
        isPopular: true,
      },
      {
        name: "Bubble Sort",
        category: "sorting",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        description: "Simple comparison-based sorting algorithm",
        steps: ["Compare adjacent elements", "Swap if necessary", "Repeat until sorted"],
        isPopular: false,
      },
      {
        name: "Binary Search",
        category: "searching",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        description: "Efficient search algorithm for sorted arrays",
        steps: ["Find middle element", "Compare with target", "Eliminate half of array", "Repeat"],
        isPopular: true,
      },
      {
        name: "Linear Search",
        category: "searching",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        description: "Sequential search through all elements",
        steps: ["Start from first element", "Compare with target", "Move to next element", "Repeat until found"],
        isPopular: false,
      },
      {
        name: "Breadth-First Search",
        category: "graph",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        description: "Graph traversal algorithm using a queue",
        steps: ["Start from root", "Visit all neighbors", "Add neighbors to queue", "Repeat"],
        isPopular: true,
      },
      {
        name: "Depth-First Search",
        category: "graph",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        description: "Graph traversal algorithm using a stack",
        steps: ["Start from root", "Go deep as possible", "Backtrack when stuck", "Repeat"],
        isPopular: true,
      },
      {
        name: "Dijkstra's Algorithm",
        category: "graph",
        timeComplexity: "O(V²)",
        spaceComplexity: "O(V)",
        description: "Shortest path algorithm for weighted graphs",
        steps: ["Initialize distances", "Select minimum distance node", "Update neighbors", "Repeat"],
        isPopular: true,
      },
      {
        name: "Traveling Salesman Problem",
        category: "graph",
        timeComplexity: "O(n!)",
        spaceComplexity: "O(n)",
        description: "Find shortest route visiting all cities once",
        steps: ["Generate all permutations", "Calculate route distances", "Find minimum", "Return optimal route"],
        isPopular: true,
      },
      {
        name: "Fibonacci (Dynamic Programming)",
        category: "dynamic-programming",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        description: "Calculate Fibonacci numbers efficiently using memoization",
        steps: ["Initialize base cases", "Store calculated values", "Use stored values", "Return result"],
        isPopular: true,
      },
    ];

    defaultAlgorithms.forEach(algorithm => {
      this.createAlgorithm(algorithm);
    });
  }

  async getAlgorithm(id: string): Promise<Algorithm | undefined> {
    return this.algorithms.get(id);
  }

  async getAlgorithmsByCategory(category: string): Promise<Algorithm[]> {
    return Array.from(this.algorithms.values()).filter(
      (algorithm) => algorithm.category === category
    );
  }

  async getAllAlgorithms(): Promise<Algorithm[]> {
    return Array.from(this.algorithms.values());
  }

  async createAlgorithm(insertAlgorithm: InsertAlgorithm): Promise<Algorithm> {
    const id = randomUUID();
    const algorithm: Algorithm = { 
      ...insertAlgorithm, 
      id,
      implementation: insertAlgorithm.implementation || null,
      steps: insertAlgorithm.steps ? Array.from(insertAlgorithm.steps) as string[] : null,
      isPopular: insertAlgorithm.isPopular || false
    };
    this.algorithms.set(id, algorithm);
    return algorithm;
  }

  async updateAlgorithm(id: string, updates: Partial<Algorithm>): Promise<Algorithm | undefined> {
    const algorithm = this.algorithms.get(id);
    if (!algorithm) return undefined;
    
    const updated = { ...algorithm, ...updates };
    this.algorithms.set(id, updated);
    return updated;
  }

  async getAlgorithmSession(id: string): Promise<AlgorithmSession | undefined> {
    return this.sessions.get(id);
  }

  async createAlgorithmSession(insertSession: InsertAlgorithmSession): Promise<AlgorithmSession> {
    const id = randomUUID();
    const session: AlgorithmSession = { 
      ...insertSession, 
      id,
      algorithmId: insertSession.algorithmId || null,
      userId: insertSession.userId || null,
      inputData: insertSession.inputData ? Array.from(insertSession.inputData) as number[] : null,
      currentStep: insertSession.currentStep || 0,
      isComplete: insertSession.isComplete || false,
      metrics: insertSession.metrics || null
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateAlgorithmSession(id: string, updates: Partial<AlgorithmSession>): Promise<AlgorithmSession | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updated = { ...session, ...updates };
    this.sessions.set(id, updated);
    return updated;
  }

  async getSessionsByUser(userId: string): Promise<AlgorithmSession[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId
    );
  }
}

export const storage = new MemStorage();
