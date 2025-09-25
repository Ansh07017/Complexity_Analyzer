import { Card, CardContent } from "@/components/ui/card";
import { Clock, MemoryStick } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { AnalysisChartData, ChartData } from "@shared/schema";

interface ComplexityChartsProps {
  chartData: AnalysisChartData | null | undefined;
}

interface RechartDataPoint {
  inputSize: string;
  value: number;
}

export default function ComplexityCharts({ chartData }: ComplexityChartsProps) {
  // Transform Chart.js data format to recharts format
  const transformDataForRecharts = (chartData: ChartData | undefined): RechartDataPoint[] => {
    if (!chartData?.labels || !chartData?.datasets || chartData.datasets.length === 0) {
      return [];
    }

    return chartData.labels.map((label, index) => ({
      inputSize: label,
      value: chartData.datasets[0]?.data?.[index] || 0,
    }));
  };

  const runtimeData = transformDataForRecharts(chartData?.runtime);
  const memoryData = transformDataForRecharts(chartData?.memory);

  // Fallback for when no data is available
  if (!chartData || (!runtimeData.length && !memoryData.length)) {
    return (
      <Card data-testid="complexity-charts">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold">Performance Analysis</h2>
          <p className="text-sm text-muted-foreground">Runtime and memory usage across different input sizes</p>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No chart data available. Run an analysis to see performance charts.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="complexity-charts">
      <div className="border-b border-border p-4">
        <h2 className="font-semibold">Performance Analysis</h2>
        <p className="text-sm text-muted-foreground">Runtime and memory usage across different input sizes</p>
      </div>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Runtime Chart */}
          <div>
            <h3 className="font-medium mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Runtime vs Input Size</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={runtimeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="inputSize" 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Runtime (seconds)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="rgb(59 130 246)" // blue-500
                    strokeWidth={2}
                    dot={{ fill: 'rgb(59 130 246)', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Runtime"
                    data-testid="runtime-line"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Memory Chart */}
          <div>
            <h3 className="font-medium mb-4 flex items-center space-x-2">
              <MemoryStick className="w-5 h-5 text-green-500" />
              <span>Memory Usage vs Input Size</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={memoryData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="inputSize" 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Memory Usage (MB)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="rgb(34 197 94)" // green-500
                    strokeWidth={2}
                    dot={{ fill: 'rgb(34 197 94)', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Memory Usage"
                    data-testid="memory-line"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}