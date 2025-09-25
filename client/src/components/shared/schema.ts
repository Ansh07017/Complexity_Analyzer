import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const algorithms = pgTable("algorithms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  timeComplexity: text("time_complexity").notNull(),
  spaceComplexity: text("space_complexity").notNull(),
  description: text("description").notNull(),
  implementation: text("implementation"),
  steps: jsonb("steps").$type<string[]>(),
  isPopular: boolean("is_popular").default(false),
});

export const algorithmSessions = pgTable("algorithm_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  algorithmId: varchar("algorithm_id").references(() => algorithms.id),
  userId: text("user_id"),
  inputData: jsonb("input_data").$type<number[]>(),
  currentStep: integer("current_step").default(0),
  isComplete: boolean("is_complete").default(false),
  metrics: jsonb("metrics").$type<{
    comparisons: number;
    swaps: number;
    steps: number;
    timeElapsed: number;
  }>(),
});

export const insertAlgorithmSchema = createInsertSchema(algorithms).omit({
  id: true,
});

export const insertAlgorithmSessionSchema = createInsertSchema(algorithmSessions).omit({
  id: true,
});

export type Algorithm = typeof algorithms.$inferSelect;
export type InsertAlgorithm = z.infer<typeof insertAlgorithmSchema>;
export type AlgorithmSession = typeof algorithmSessions.$inferSelect;
export type InsertAlgorithmSession = z.infer<typeof insertAlgorithmSessionSchema>;
