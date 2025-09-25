import { GraphVisualizer } from "@/components/graph/graph-visualizer";

export default function GraphPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Graph Algorithms</h1>
        <p className="text-muted-foreground">
          Explore graph traversal and pathfinding algorithms with interactive node and edge manipulation
        </p>
      </div>
      
      <GraphVisualizer />
    </div>
  );
}
