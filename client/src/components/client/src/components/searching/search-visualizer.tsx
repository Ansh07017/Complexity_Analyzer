import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplexityBadge } from "@/components/algorithm/complexity-badge";
import { useAlgorithmAnimation } from "@/hooks/use-algorithm-animation";
import { generateSortedArray, binarySearch } from "@/lib/algorithms";
import { cn } from "@/lib/utils";

const searchAlgorithms = [
  { value: "binary", label: "Binary Search", complexity: "O(log n)" },
  { value: "linear", label: "Linear Search", complexity: "O(n)" },
  { value: "jump", label: "Jump Search", complexity: "O(√n)" }
];

export function SearchVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("binary");
  const [searchTarget, setSearchTarget] = useState("");
  const [currentStep, setCurrentStep] = useState<any>(null);
  const [searchResult, setSearchResult] = useState<"found" | "not-found" | null>(null);
  
  const data = useMemo(() => generateSortedArray(16, 5, 95), []);
  const target = parseInt(searchTarget) || data[3]; // Default to a value in the array
  const stepGenerator = useMemo(() => binarySearch(data, target), [data, target]);
  
  const { state, play, pause, stop, step, setSpeed } = useAlgorithmAnimation({
    initialData: data,
    stepGenerator,
    onStepChange: (stepData) => {
      setCurrentStep(stepData);
      if (stepData.description.includes("Found")) {
        setSearchResult("found");
      } else if (stepData.description.includes("not found")) {
        setSearchResult("not-found");
      }
    }
  });

  const selectedAlgorithmInfo = searchAlgorithms.find(alg => alg.value === selectedAlgorithm);

  const handleSearch = () => {
    setSearchResult(null);
    play();
  };

  const reset = () => {
    stop();
    setSearchResult(null);
    setCurrentStep(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Searching Algorithm Visualization
            <div className="flex items-center space-x-3">
              <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                <SelectTrigger className="w-48" data-testid="select-search-algorithm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {searchAlgorithms.map((alg) => (
                    <SelectItem key={alg.value} value={alg.value}>
                      {alg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="Search for..."
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                className="w-32"
                data-testid="input-search-target"
              />
              
              <Button 
                onClick={handleSearch}
                disabled={state.isPlaying}
                data-testid="button-start-search"
              >
                Search
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Array Representation */}
          <div className="bg-muted rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
              {data.map((value, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-12 h-12 border-2 border-border rounded flex items-center justify-center font-mono text-sm transition-all duration-300",
                    state.highlights.includes(index) 
                      ? "bg-accent border-primary font-bold" 
                      : "bg-background",
                    searchResult === "found" && value === target && "bg-green-100 border-green-500"
                  )}
                  data-testid={`array-element-${index}`}
                >
                  {value}
                </div>
              ))}
            </div>
            
            {/* Search Progress Indicators */}
            {selectedAlgorithm === "binary" && currentStep && (
              <div className="mt-4 flex items-center justify-center space-x-8">
                <div className="text-sm">
                  <span className="text-muted-foreground">Target:</span>
                  <span className="font-mono font-bold ml-1">{target}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Steps:</span>
                  <span className="font-mono font-bold ml-1">{state.currentStep}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Comparisons:</span>
                  <span className="font-mono font-bold ml-1">{state.comparisons}</span>
                </div>
              </div>
            )}
          </div>

          {/* Step Control */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={step}
              disabled={state.isPlaying}
              variant="outline"
              data-testid="button-step-search"
            >
              Step Through
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              data-testid="button-reset-search"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-primary">
              {state.comparisons}
            </div>
            <div className="text-sm text-muted-foreground">Comparisons Made</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">
              <ComplexityBadge 
                complexity={selectedAlgorithmInfo?.complexity || "O(log n)"} 
                className="text-lg px-3 py-1"
              />
            </div>
            <div className="text-sm text-muted-foreground">Time Complexity</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className={cn(
              "text-2xl font-bold",
              searchResult === "found" ? "text-green-600" : 
              searchResult === "not-found" ? "text-red-600" : 
              "text-muted-foreground"
            )}>
              {searchResult === "found" ? "Found" : 
               searchResult === "not-found" ? "Not Found" : 
               "Searching..."}
            </div>
            <div className="text-sm text-muted-foreground">Search Result</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Step Description */}
      {currentStep && (
        <Card>
          <CardHeader>
            <CardTitle>Current Step</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{currentStep.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
