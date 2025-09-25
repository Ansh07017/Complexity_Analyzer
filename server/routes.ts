import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAlgorithmSchema, insertAlgorithmSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all algorithms
  app.get("/api/algorithms", async (req, res) => {
    try {
      const algorithms = await storage.getAllAlgorithms();
      res.json(algorithms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch algorithms" });
    }
  });

  // Get algorithms by category
  app.get("/api/algorithms/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const algorithms = await storage.getAlgorithmsByCategory(category);
      res.json(algorithms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch algorithms by category" });
    }
  });

  // Get single algorithm
  app.get("/api/algorithms/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const algorithm = await storage.getAlgorithm(id);
      if (!algorithm) {
        return res.status(404).json({ message: "Algorithm not found" });
      }
      res.json(algorithm);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch algorithm" });
    }
  });

  // Create new algorithm
  app.post("/api/algorithms", async (req, res) => {
    try {
      const result = insertAlgorithmSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid algorithm data", errors: result.error.errors });
      }
      
      const algorithm = await storage.createAlgorithm(result.data);
      res.status(201).json(algorithm);
    } catch (error) {
      res.status(500).json({ message: "Failed to create algorithm" });
    }
  });

  // Create algorithm session
  app.post("/api/sessions", async (req, res) => {
    try {
      const result = insertAlgorithmSessionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid session data", errors: result.error.errors });
      }
      
      const session = await storage.createAlgorithmSession(result.data);
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Update algorithm session
  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.updateAlgorithmSession(id, req.body);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // Get user sessions
  app.get("/api/sessions/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const sessions = await storage.getSessionsByUser(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user sessions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
