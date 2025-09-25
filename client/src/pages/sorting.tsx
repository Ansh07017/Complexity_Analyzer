import { SortingVisualizer } from "@/components/sorting/sorting-visualizer";

export default function SortingPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Sorting Algorithms</h1>
        <p className="text-muted-foreground">
          Interactive visualizations of popular sorting algorithms with step-by-step analysis
        </p>
      </div>
      
      <SortingVisualizer />
    </div>
  );
}
