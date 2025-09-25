export type AlgorithmCategory = "sorting" | "searching" | "graph" | "dynamic-programming";

export type ComplexityLevel = "excellent" | "good" | "fair" | "poor";

export interface AlgorithmStep {
  id: number;
  description: string;
  code?: string;
  highlight?: number[];
  metrics?: {
    comparisons?: number;
    swaps?: number;
    timeComplexity?: string;
  };
}

export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  speed: number;
  data: number[];
  highlights: number[];
  comparisons: number;
  swaps: number;
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  visited?: boolean;
  current?: boolean;
  distance?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  highlighted?: boolean;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentNode?: string;
  visitedNodes: Set<string>;
  queue: string[];
  stack: string[];
  distances: Map<string, number>;
}

export interface RealWorldExample {
  id: string;
  title: string;
  algorithm: string;
  description: string;
  icon: string;
  imageUrl: string;
  complexity: string;
  category: AlgorithmCategory;
}
