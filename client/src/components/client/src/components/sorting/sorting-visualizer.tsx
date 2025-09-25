import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VisualizationControls } from "@/components/algorithm/visualization-controls";
import { ComplexityBadge } from "@/components/algorithm/complexity-badge";
import { useAlgorithmAnimation } from "@/hooks/use-algorithm-animation";
import { generateRandomArray, bubbleSort } from "@/lib/algorithms";
import { cn } from "@/lib/utils";

const sortingAlgorithms = [
  { value: "bubble", label: "Bubble Sort", complexity: "O(n²)" },
  { value: "quick", label: "Quick Sort", complexity: "O(n log n)" },
  { value: "merge", label: "Merge Sort", complexity: "O(n log n)" },
  { value: "insertion", label: "Insertion Sort", complexity: "O(n²)" }
];

export function SortingVisualizer() {
  const [arraySize, setArraySize] = useState(20);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble");
  const [currentStep, setCurrentStep] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const data = useMemo(() => generateRandomArray(arraySize), [arraySize, refreshKey]);
  const stepGenerator = useMemo(() => bubbleSort(data), [data]);
  
  const { state, play, pause, stop, step, setSpeed } = useAlgorithmAnimation({
    initialData: data,
    stepGenerator,
    onStepChange: setCurrentStep
  });

  const selectedAlgorithmInfo = sortingAlgorithms.find(alg => alg.value === selectedAlgorithm);
  const maxValue = Math.max(...state.data);

  const regenerateArray = () => {
    stop();
    // Force regeneration of array with current size
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Sorting Algorithm Visualization
            <div className="flex items-center space-x-3">
              <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                <SelectTrigger className="w-48" data-testid="select-algorithm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortingAlgorithms.map((alg) => (
                    <SelectItem key={alg.value} value={alg.value}>
                      {alg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-muted-foreground">Array Size:</label>
                <Slider
                  value={[arraySize]}
                  onValueChange={(value) => setArraySize(value[0])}
                  min={10}
                  max={100}
                  step={10}
                  className="w-20"
                  data-testid="slider-array-size"
                />
                <span className="text-sm font-mono min-w-[3ch]">{arraySize}</span>
              </div>
              
              <Button 
                onClick={regenerateArray} 
                variant="outline" 
                size="sm"
                data-testid="button-regenerate"
              >
                New Array
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Visualization Area */}
          <div className="visualization-area border border-border rounded-lg p-6 mb-6">
            <div className="flex items-end justify-center space-x-1 h-64 overflow-x-auto">
              {state.data.map((value, index) => (
                <div
                  key={index}
                  className={cn(
                    "array-bar bg-primary rounded-t transition-all duration-300",
                    state.highlights.includes(index) && "comparing",
                    `min-w-[${Math.max(2, 200 / arraySize)}px]`
                  )}
                  style={{
                    height: `${(value / maxValue) * 200}px`,
                    width: `${Math.max(8, 200 / arraySize)}px`
                  }}
                  data-testid={`array-bar-${index}`}
                />
              ))}
            </div>
          </div>
          
          {/* Animation Controls */}
          <VisualizationControls
            state={state}
            onPlay={play}
            onPause={pause}
            onStop={stop}
            onStep={step}
            onSpeedChange={setSpeed}
            onReset={regenerateArray}
          />
        </CardContent>
      </Card>

      {/* Step Analysis and Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Step Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Current Operation:</span>
                <span className="font-mono">
                  {currentStep?.description || "Ready to start"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Comparisons:</span>
                <span className="font-mono">{state.comparisons}</span>
              </div>
              <div className="flex justify-between">
                <span>Swaps:</span>
                <span className="font-mono">{state.swaps}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Complexity:</span>
                <ComplexityBadge 
                  complexity={selectedAlgorithmInfo?.complexity || "O(n²)"} 
                />
              </div>
              <div className="flex justify-between">
                <span>Current Step:</span>
                <span className="font-mono">{state.currentStep}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Algorithm Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortingAlgorithms.map((alg) => (
                <div 
                  key={alg.value}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-colors",
                    selectedAlgorithm === alg.value 
                      ? "bg-primary/10 border-primary" 
                      : "hover:bg-accent"
                  )}
                  data-testid={`algorithm-comparison-${alg.value}`}
                >
                  <span className="font-medium">{alg.label}</span>
                  <ComplexityBadge complexity={alg.complexity} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
