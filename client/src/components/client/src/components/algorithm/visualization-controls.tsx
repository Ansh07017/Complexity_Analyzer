import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, SkipForward, RotateCcw } from "lucide-react";
import { AnimationState } from "@/types/algorithm";

interface VisualizationControlsProps {
  state: AnimationState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onStep: () => void;
  onSpeedChange: (speed: number) => void;
  onReset?: () => void;
}

export function VisualizationControls({
  state,
  onPlay,
  onPause,
  onStop,
  onStep,
  onSpeedChange,
  onReset
}: VisualizationControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-card border border-border rounded-lg">
      {state.isPlaying ? (
        <Button
          onClick={onPause}
          variant="outline"
          size="sm"
          data-testid="button-pause"
        >
          <Pause className="w-4 h-4 mr-2" />
          Pause
        </Button>
      ) : (
        <Button
          onClick={onPlay}
          data-testid="button-play"
          size="sm"
        >
          <Play className="w-4 h-4 mr-2" />
          {state.isPaused ? "Resume" : "Play"}
        </Button>
      )}
      
      <Button
        onClick={onStop}
        variant="outline"
        size="sm"
        data-testid="button-stop"
      >
        <Square className="w-4 h-4 mr-2" />
        Stop
      </Button>
      
      <Button
        onClick={onStep}
        variant="outline"
        size="sm"
        disabled={state.isPlaying}
        data-testid="button-step"
      >
        <SkipForward className="w-4 h-4 mr-2" />
        Step
      </Button>
      
      {onReset && (
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          data-testid="button-reset"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      )}
      
      <div className="flex items-center space-x-2 ml-6">
        <label className="text-sm text-muted-foreground">Speed:</label>
        <Slider
          value={[state.speed]}
          onValueChange={(value) => onSpeedChange(value[0])}
          min={1}
          max={5}
          step={1}
          className="w-20"
          data-testid="slider-speed"
        />
        <span className="text-sm font-mono min-w-[2ch]">{state.speed}x</span>
      </div>
    </div>
  );
}
