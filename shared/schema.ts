import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull(),
  language: varchar("language", { length: 20 }).notNull(),
  maxInputSize: integer("max_input_size").notNull().default(10000),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  timeComplexityBest: varchar("time_complexity_best", { length: 50 }),
  timeComplexityAverage: varchar("time_complexity_average", { length: 50 }),
  timeComplexityWorst: varchar("time_complexity_worst", { length: 50 }),
  spaceComplexity: varchar("space_complexity", { length: 50 }),
  algorithmName: varchar("algorithm_name", { length: 100 }),
  algorithmCategory: varchar("algorithm_category", { length: 50 }),
  algorithmType: varchar("algorithm_type", { length: 100 }),
  executionResults: jsonb("execution_results"),
  warnings: jsonb("warnings"),
  recommendations: jsonb("recommendations"),
  learningResources: jsonb("learning_resources"),
  chartData: jsonb("chart_data"),
  userId: varchar("user_id", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const updateAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
}).partial();

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type UpdateAnalysis = z.infer<typeof updateAnalysisSchema>;

// Code execution result types
export const ExecutionResult = z.object({
  inputSize: z.number(),
  runtime: z.number(),
  memoryUsage: z.number(),
  status: z.enum(["success", "timeout", "error"]),
  error: z.string().optional(),
});

export const ComplexityAnalysis = z.object({
  timeComplexityBest: z.string(),
  timeComplexityAverage: z.string(),
  timeComplexityWorst: z.string(),
  spaceComplexity: z.string(),
  confidence: z.number(),
  algorithmName: z.string().optional(),
  algorithmCategory: z.string().optional(),
  algorithmType: z.string().optional(),
  testResults: z.array(ExecutionResult),
});

export const AnalysisWarning = z.object({
  type: z.enum(["performance", "memory", "timeout", "error"]),
  message: z.string(),
  severity: z.enum(["low", "medium", "high"]),
});

export const Recommendation = z.object({
  type: z.enum(["optimization", "alternative", "learning"]),
  title: z.string(),
  description: z.string(),
  links: z.array(z.string()).optional(),
});

export const LearningResource = z.object({
  title: z.string(),
  url: z.string(),
  source: z.enum(["geeksforgeeks", "freecodecamp", "other"]),
  description: z.string(),
});

export type ExecutionResultType = z.infer<typeof ExecutionResult>;
export type ComplexityAnalysisType = z.infer<typeof ComplexityAnalysis>;
export type AnalysisWarningType = z.infer<typeof AnalysisWarning>;
export type RecommendationType = z.infer<typeof Recommendation>;
export type LearningResourceType = z.infer<typeof LearningResource>;

// Chart data types for better TypeScript support
export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface AnalysisChartData {
  runtime?: ChartData;
  memory?: ChartData;
}

// Type guards for runtime type checking
export function isAnalysisWarningArray(value: any): value is AnalysisWarningType[] {
  return Array.isArray(value) && value.every(item => 
    typeof item === 'object' && 
    typeof item.type === 'string' && 
    typeof item.message === 'string' &&
    typeof item.severity === 'string'
  );
}

export function isRecommendationArray(value: any): value is RecommendationType[] {
  return Array.isArray(value) && value.every(item =>
    typeof item === 'object' &&
    typeof item.type === 'string' &&
    typeof item.title === 'string' &&
    typeof item.description === 'string'
  );
}

export function isLearningResourceArray(value: any): value is LearningResourceType[] {
  return Array.isArray(value) && value.every(item =>
    typeof item === 'object' &&
    typeof item.title === 'string' &&
    typeof item.url === 'string' &&
    typeof item.source === 'string' &&
    typeof item.description === 'string'
  );
}

export function isExecutionResultArray(value: any): value is ExecutionResultType[] {
  return Array.isArray(value) && value.every(item =>
    typeof item === 'object' &&
    typeof item.inputSize === 'number' &&
    typeof item.runtime === 'number' &&
    typeof item.memoryUsage === 'number' &&
    typeof item.status === 'string'
  );
}

export function isAnalysisChartData(value: any): value is AnalysisChartData {
  return typeof value === 'object' && value !== null;
}
