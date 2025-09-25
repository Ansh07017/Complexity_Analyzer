import { useState, useEffect, useRef, useCallback } from "react";
import { AnimationState } from "@/types/algorithm";

interface UseAlgorithmAnimationProps {
  initialData: number[];
  stepGenerator: AsyncGenerator<any>;
  onStepChange?: (step: any) => void;
}

export function useAlgorithmAnimation({ 
  initialData, 
  stepGenerator, 
  onStepChange 
}: UseAlgorithmAnimationProps) {
  const [state, setState] = useState<AnimationState>({
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
    speed: 3,
    data: [...initialData],
    highlights: [],
    comparisons: 0,
    swaps: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const generatorRef = useRef<AsyncGenerator<any> | null>(null);

  const getAnimationDelay = useCallback(() => {
    return 2000 - (state.speed - 1) * 400; // Speed 1 = 2000ms, Speed 5 = 400ms
  }, [state.speed]);

  const play = useCallback(() => {
    if (state.isPaused) {
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    } else {
      setState(prev => ({ 
        ...prev, 
        isPlaying: true, 
        isPaused: false,
        currentStep: 0,
        data: [...initialData],
        highlights: [],
        comparisons: 0,
        swaps: 0
      }));
      generatorRef.current = stepGenerator;
    }
  }, [state.isPaused, initialData, stepGenerator]);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: false,
      currentStep: 0,
      data: [...initialData],
      highlights: [],
      comparisons: 0,
      swaps: 0
    }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    generatorRef.current = null;
  }, [initialData]);

  // Update state when initialData changes (for array regeneration)
  useEffect(() => {
    setState(prev => ({
      ...prev,
      data: [...initialData],
      highlights: [],
      comparisons: 0,
      swaps: 0,
      currentStep: 0
    }));
  }, [initialData]);

  const step = useCallback(async () => {
    if (!generatorRef.current) {
      generatorRef.current = stepGenerator;
    }
    
    try {
      const { value, done } = await generatorRef.current.next();
      
      if (done) {
        setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
        return;
      }
      
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        highlights: value.highlight || [],
        comparisons: value.metrics?.comparisons || prev.comparisons,
        swaps: value.metrics?.swaps || prev.swaps
      }));
      
      onStepChange?.(value);
    } catch (error) {
      console.error("Error in algorithm step:", error);
      setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    }
  }, [stepGenerator, onStepChange]);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  // Auto-play when playing
  useEffect(() => {
    if (state.isPlaying && !intervalRef.current) {
      intervalRef.current = setInterval(step, getAnimationDelay());
    } else if (!state.isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isPlaying, step, getAnimationDelay]);

  // Update interval delay when speed changes
  useEffect(() => {
    if (state.isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(step, getAnimationDelay());
    }
  }, [state.speed, state.isPlaying, step, getAnimationDelay]);

  return {
    state,
    play,
    pause,
    stop,
    step,
    setSpeed
  };
}
