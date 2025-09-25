import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplexityBadge } from "@/components/algorithm/complexity-badge";
import { GraphNode, GraphEdge, GraphState } from "@/types/algorithm";
import { cn } from "@/lib/utils";

const graphAlgorithms = [
  { value: "bfs", label: "Breadth-First Search (BFS)", complexity: "O(V + E)" },
  { value: "dfs", label: "Depth-First Search (DFS)", complexity: "O(V + E)" },
  { value: "dijkstra", label: "Dijkstra's Algorithm", complexity: "O(V²)" },
  { value: "tsp", label: "Traveling Salesman (TSP)", complexity: "O(n!)" }
];

const defaultNodes: GraphNode[] = [
  { id: "A", label: "A", x: 50, y: 50 },
  { id: "B", label: "B", x: 200, y: 50 },
  { id: "C", label: "C", x: 80, y: 180 },
  { id: "D", label: "D", x: 200, y: 180 }
];

const defaultEdges: GraphEdge[] = [
  { from: "A", to: "B", weight: 3 },
  { from: "A", to: "C", weight: 4 },
  { from: "B", to: "D", weight: 5 },
  { from: "C", to: "D", weight: 2 }
];

export function GraphVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bfs");
  const [graphState, setGraphState] = useState<GraphState>({
    nodes: defaultNodes,
    edges: defaultEdges,
    visitedNodes: new Set(),
    queue: [],
    stack: [],
    distances: new Map()
  });
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const selectedAlgorithmInfo = graphAlgorithms.find(alg => alg.value === selectedAlgorithm);

  const startAlgorithm = () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    // Initialize based on algorithm
    if (selectedAlgorithm === "bfs") {
      setGraphState(prev => ({
        ...prev,
        currentNode: "A",
        visitedNodes: new Set(["A"]),
        queue: ["B", "C"],
        stack: [],
        distances: new Map()
      }));
    } else if (selectedAlgorithm === "dijkstra") {
      setGraphState(prev => ({
        ...prev,
        currentNode: "A",
        visitedNodes: new Set(),
        distances: new Map([
          ["A", 0],
          ["B", 3],
          ["C", 4],
          ["D", Infinity]
        ])
      }));
    }
  };

  const stepAlgorithm = () => {
    if (!isRunning) return;
    
    setCurrentStep(prev => prev + 1);
    
    // Simple step simulation for BFS
    if (selectedAlgorithm === "bfs" && graphState.queue.length > 0) {
      const nextNode = graphState.queue[0];
      setGraphState(prev => ({
        ...prev,
        currentNode: nextNode,
        visitedNodes: new Set(Array.from(prev.visitedNodes).concat([nextNode])),
        queue: prev.queue.slice(1)
      }));
    }
  };

  const resetGraph = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setGraphState({
      nodes: defaultNodes,
      edges: defaultEdges,
      visitedNodes: new Set(),
      queue: [],
      stack: [],
      distances: new Map()
    });
  };

  const addNode = () => {
    const newNodeId = String.fromCharCode(65 + graphState.nodes.length);
    const newNode: GraphNode = {
      id: newNodeId,
      label: newNodeId,
      x: Math.random() * 200 + 50,
      y: Math.random() * 150 + 50
    };
    
    setGraphState(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Graph Algorithm Visualization
            <div className="flex items-center space-x-3">
              <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                <SelectTrigger className="w-64" data-testid="select-graph-algorithm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {graphAlgorithms.map((alg) => (
                    <SelectItem key={alg.value} value={alg.value}>
                      {alg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={addNode}
                variant="outline"
                size="sm"
                data-testid="button-add-node"
              >
                Add Node
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph Visualization Area */}
            <div className="lg:col-span-2">
              <div className="visualization-area border border-border rounded-lg p-6 relative h-80">
                {/* Render edges */}
                <svg className="absolute inset-0 w-full h-full">
                  {graphState.edges.map((edge, index) => {
                    const fromNode = graphState.nodes.find(n => n.id === edge.from);
                    const toNode = graphState.nodes.find(n => n.id === edge.to);
                    
                    if (!fromNode || !toNode) return null;
                    
                    return (
                      <g key={index}>
                        <line
                          x1={fromNode.x + 16}
                          y1={fromNode.y + 16}
                          x2={toNode.x + 16}
                          y2={toNode.y + 16}
                          stroke="hsl(var(--border))"
                          strokeWidth="2"
                          className={cn(
                            "transition-all duration-300",
                            edge.highlighted && "stroke-primary"
                          )}
                        />
                        {edge.weight && (
                          <text
                            x={(fromNode.x + toNode.x) / 2 + 16}
                            y={(fromNode.y + toNode.y) / 2 + 20}
                            className="text-xs fill-muted-foreground font-mono"
                            textAnchor="middle"
                          >
                            {edge.weight}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
                
                {/* Render nodes */}
                {graphState.nodes.map((node) => (
                  <div
                    key={node.id}
                    className={cn(
                      "graph-node absolute",
                      node.id === graphState.currentNode ? "current" : 
                      graphState.visitedNodes.has(node.id) ? "visited" : "unvisited"
                    )}
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`
                    }}
                    data-testid={`graph-node-${node.id}`}
                  >
                    {node.label}
                  </div>
                ))}
                
                {/* Algorithm State Display */}
                {selectedAlgorithm === "bfs" && (
                  <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-3">
                    <h5 className="text-sm font-semibold mb-2">BFS Queue</h5>
                    <div className="flex space-x-1">
                      {graphState.queue.map((nodeId, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 bg-accent border border-border rounded flex items-center justify-center text-xs"
                          data-testid={`queue-item-${nodeId}`}
                        >
                          {nodeId}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center space-x-4 mt-4">
                <Button
                  onClick={startAlgorithm}
                  disabled={isRunning}
                  data-testid="button-start-algorithm"
                >
                  Start {selectedAlgorithmInfo?.label.split(" ")[0]}
                </Button>
                <Button
                  onClick={stepAlgorithm}
                  variant="outline"
                  disabled={!isRunning}
                  data-testid="button-step-algorithm"
                >
                  Step
                </Button>
                <Button
                  onClick={resetGraph}
                  variant="outline"
                  data-testid="button-reset-graph"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Algorithm Information Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Algorithm Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Node:</span>
                      <span className="font-mono font-bold">
                        {graphState.currentNode || "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visited Nodes:</span>
                      <span className="font-mono">{graphState.visitedNodes.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Queue Size:</span>
                      <span className="font-mono">{graphState.queue.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Complexity:</span>
                      <ComplexityBadge 
                        complexity={selectedAlgorithmInfo?.complexity || "O(V + E)"} 
                      />
                    </div>
                    <div className="flex justify-between">
                      <span>Steps:</span>
                      <span className="font-mono">{currentStep}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedAlgorithm === "dijkstra" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Distance Table</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {Array.from(graphState.distances.entries()).map(([nodeId, distance]) => (
                        <div 
                          key={nodeId}
                          className="flex justify-between"
                          data-testid={`distance-${nodeId}`}
                        >
                          <span>Node {nodeId}:</span>
                          <span className="font-mono">
                            {distance === Infinity ? "∞" : distance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Graph Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full"
                      onClick={addNode}
                      data-testid="button-add-node-panel"
                    >
                      Add Node
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      data-testid="button-add-edge"
                    >
                      Add Edge
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="destructive"
                      onClick={resetGraph}
                      data-testid="button-clear-graph"
                    >
                      Clear Graph
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
