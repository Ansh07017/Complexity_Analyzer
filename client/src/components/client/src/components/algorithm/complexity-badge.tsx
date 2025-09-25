import { cn } from "@/lib/utils";
import { getComplexityLevel, getComplexityColor } from "@/lib/algorithms";

interface ComplexityBadgeProps {
  complexity: string;
  className?: string;
}

export function ComplexityBadge({ complexity, className }: ComplexityBadgeProps) {
  const level = getComplexityLevel(complexity);
  const colorClass = getComplexityColor(level);

  return (
    <span 
      className={cn("complexity-badge", colorClass, className)}
      data-testid={`complexity-badge-${complexity.replace(/[^a-zA-Z0-9]/g, '-')}`}
    >
      {complexity}
    </span>
  );
}
