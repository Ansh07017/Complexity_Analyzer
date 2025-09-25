import { SearchVisualizer } from "@/components/searching/search-visualizer";

export default function SearchingPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Searching Algorithms</h1>
        <p className="text-muted-foreground">
          Interactive demonstrations of efficient searching techniques with real-time complexity analysis
        </p>
      </div>
      
      <SearchVisualizer />
    </div>
  );
}
