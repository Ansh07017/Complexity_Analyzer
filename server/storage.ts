import { type Analysis, type InsertAnalysis, type UpdateAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAnalysis(id: string): Promise<Analysis | undefined>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  updateAnalysis(id: string, updates: UpdateAnalysis): Promise<Analysis | undefined>;
  getAllAnalyses(): Promise<Analysis[]>;
}

export class MemStorage implements IStorage {
  private analyses: Map<string, Analysis>;

  constructor() {
    this.analyses = new Map();
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    return this.analyses.get(id);
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = randomUUID();
    const analysis: Analysis = {
      ...insertAnalysis,
      id,
      status: insertAnalysis.status || "pending",
      maxInputSize: insertAnalysis.maxInputSize || 10000,
      timeComplexityBest: null,
      timeComplexityAverage: null,
      timeComplexityWorst: null,
      spaceComplexity: null,
      algorithmName: null,
      algorithmCategory: null,
      algorithmType: null,
      executionResults: null,
      warnings: null,
      recommendations: null,
      learningResources: null,
      chartData: null,
      userId: null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async updateAnalysis(id: string, updates: UpdateAnalysis): Promise<Analysis | undefined> {
    const existing = this.analyses.get(id);
    if (!existing) return undefined;

    const updated: Analysis = {
      ...existing,
      ...updates,
      ...(updates.status === "completed" && !existing.completedAt ? { completedAt: new Date() } : {}),
    };
    
    this.analyses.set(id, updated);
    return updated;
  }

  async getAllAnalyses(): Promise<Analysis[]> {
    return Array.from(this.analyses.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }
}

export const storage = new MemStorage();
