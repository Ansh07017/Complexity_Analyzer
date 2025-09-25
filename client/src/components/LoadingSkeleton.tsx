import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  variant?: 'analysis' | 'chart' | 'results' | 'status' | 'list';
  className?: string;
}

export function LoadingSkeleton({ variant = 'analysis', className = '' }: LoadingSkeletonProps) {
  const renderAnalysisSkeleton = () => (
    <Card className={className} data-testid="loading-skeleton-analysis">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  const renderChartSkeleton = () => (
    <Card className={className} data-testid="loading-skeleton-chart">
      <div className="border-b border-border p-4">
        <Skeleton className="h-5 w-[200px]" />
        <Skeleton className="h-3 w-[300px] mt-2" />
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderResultsSkeleton = () => (
    <Card className={className} data-testid="loading-skeleton-results">
      <div className="border-b border-border p-4">
        <Skeleton className="h-5 w-[180px]" />
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="border-t pt-4 space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-3 w-[80px]" />
                <Skeleton className="h-3 w-[60px]" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStatusSkeleton = () => (
    <Card className={className} data-testid="loading-skeleton-status">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-[130px]" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-3 w-[120px]" />
              </div>
              <Skeleton className="h-5 w-[60px]" />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-[100px] mt-1" />
        </div>
      </CardContent>
    </Card>
  );

  const renderListSkeleton = () => (
    <div className={`space-y-3 ${className}`} data-testid="loading-skeleton-list">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
              <Skeleton className="h-8 w-[80px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  switch (variant) {
    case 'chart':
      return renderChartSkeleton();
    case 'results':
      return renderResultsSkeleton();
    case 'status':
      return renderStatusSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'analysis':
    default:
      return renderAnalysisSkeleton();
  }
}

// Inline loading states for smaller components
export function InlineLoader({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className="flex items-center space-x-2" data-testid="inline-loader">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  );
}

// Pulsing dots loader
export function PulsingDots() {
  return (
    <div className="flex space-x-1" data-testid="pulsing-dots">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}