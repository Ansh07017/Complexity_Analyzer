// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  algorithms;
  sessions;
  constructor() {
    this.algorithms = /* @__PURE__ */ new Map();
    this.sessions = /* @__PURE__ */ new Map();
    this.seedData();
  }
  seedData() {
    const defaultAlgorithms = [
      {
        name: "Quick Sort",
        category: "sorting",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(log n)",
        description: "Divide-and-conquer sorting algorithm that picks\n a pivot and partitions the array",
        steps: ["Choose pivot", "Partition array", "Recursively sort subarrays"],
        isPopular: true
      },
      {
        name: "Merge Sort",
        category: "sorting",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        description: "Stable divide-and-conquer sorting algorithm",
        steps: ["Divide array", "Sort subarrays", "Merge sorted subarrays"],
        isPopular: true
      },
      {
        name: "Bubble Sort",
        category: "sorting",
        timeComplexity: "O(n\xB2)",
        spaceComplexity: "O(1)",
        description: "Simple comparison-based sorting algorithm",
        steps: ["Compare adjacent elements", "Swap if necessary", "Repeat until sorted"],
        isPopular: false
      },
      {
        name: "Binary Search",
        category: "searching",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        description: "Efficient search algorithm for sorted arrays",
        steps: ["Find middle element", "Compare with target", "Eliminate half of array", "Repeat"],
        isPopular: true
      },
      {
        name: "Linear Search",
        category: "searching",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        description: "Sequential search through all elements",
        steps: ["Start from first element", "Compare with target", "Move to next element", "Repeat until found"],
        isPopular: false
      },
      {
        name: "Breadth-First Search",
        category: "graph",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        description: "Graph traversal algorithm using a queue",
        steps: ["Start from root", "Visit all neighbors", "Add neighbors to queue", "Repeat"],
        isPopular: true
      },
      {
        name: "Depth-First Search",
        category: "graph",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        description: "Graph traversal algorithm using a stack",
        steps: ["Start from root", "Go deep as possible", "Backtrack when stuck", "Repeat"],
        isPopular: true
      },
      {
        name: "Dijkstra's Algorithm",
        category: "graph",
        timeComplexity: "O(V\xB2)",
        spaceComplexity: "O(V)",
        description: "Shortest path algorithm for weighted graphs",
        steps: ["Initialize distances", "Select minimum distance node", "Update neighbors", "Repeat"],
        isPopular: true
      },
      {
        name: "Traveling Salesman Problem",
        category: "graph",
        timeComplexity: "O(n!)",
        spaceComplexity: "O(n)",
        description: "Find shortest route visiting all cities once",
        steps: ["Generate all permutations", "Calculate route distances", "Find minimum", "Return optimal route"],
        isPopular: true
      },
      {
        name: "Fibonacci (Dynamic Programming)",
        category: "dynamic-programming",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        description: "Calculate Fibonacci numbers efficiently using\n memoization",
        steps: ["Initialize base cases", "Store calculated values", "Use stored values", "Return result"],
        isPopular: true
      }
    ];
    defaultAlgorithms.forEach((algorithm) => {
      this.createAlgorithm(algorithm);
    });
  }
  async getAlgorithm(id) {
    return this.algorithms.get(id);
  }
  async getAlgorithmsByCategory(category) {
    return Array.from(this.algorithms.values()).filter(
      (algorithm) => algorithm.category === category
    );
  }
  async getAllAlgorithms() {
    return Array.from(this.algorithms.values());
  }
  async createAlgorithm(insertAlgorithm) {
    const id = randomUUID();
    const algorithm = {
      ...insertAlgorithm,
      id,
      implementation: insertAlgorithm.implementation || null,
      steps: insertAlgorithm.steps ? Array.from(insertAlgorithm.steps) : null,
      isPopular: insertAlgorithm.isPopular || false
    };
    this.algorithms.set(id, algorithm);
    return algorithm;
  }
  async updateAlgorithm(id, updates) {
    const algorithm = this.algorithms.get(id);
    if (!algorithm) return void 0;
    const updated = { ...algorithm, ...updates };
    this.algorithms.set(id, updated);
    return updated;
  }
  async getAlgorithmSession(id) {
    return this.sessions.get(id);
  }
  async createAlgorithmSession(insertSession) {
    const id = randomUUID();
    const session = {
      ...insertSession,
      id,
      algorithmId: insertSession.algorithmId || null,
      userId: insertSession.userId || null,
      inputData: insertSession.inputData ? Array.from(insertSession.inputData) : null,
      currentStep: insertSession.currentStep || 0,
      isComplete: insertSession.isComplete || false,
      metrics: insertSession.metrics || null
    };
    this.sessions.set(id, session);
    return session;
  }
  async updateAlgorithmSession(id, updates) {
    const session = this.sessions.get(id);
    if (!session) return void 0;
    const updated = { ...session, ...updates };
    this.sessions.set(id, updated);
    return updated;
  }
  async getSessionsByUser(userId) {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId
    );
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var algorithms = pgTable("algorithms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  timeComplexity: text("time_complexity").notNull(),
  spaceComplexity: text("space_complexity").notNull(),
  description: text("description").notNull(),
  implementation: text("implementation"),
  steps: jsonb("steps").$type(),
  isPopular: boolean("is_popular").default(false)
});
var algorithmSessions = pgTable("algorithm_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  algorithmId: varchar("algorithm_id").references(() => algorithms.id),
  userId: text("user_id"),
  inputData: jsonb("input_data").$type(),
  currentStep: integer("current_step").default(0),
  isComplete: boolean("is_complete").default(false),
  metrics: jsonb("metrics").$type()
});
var insertAlgorithmSchema = createInsertSchema(algorithms).omit({
  id: true
});
var insertAlgorithmSessionSchema = createInsertSchema(algorithmSessions).omit({
  id: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/algorithms", async (req, res) => {
    try {
      const algorithms2 = await storage.getAllAlgorithms();
      res.json(algorithms2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch algorithms" });
    }
  });
  app2.get("/api/algorithms/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const algorithms2 = await storage.getAlgorithmsByCategory(category);
      res.json(algorithms2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch algorithms by category" });
    }
  });
  app2.get("/api/algorithms/:id", async (req, res) => {
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
  app2.post("/api/algorithms", async (req, res) => {
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
  app2.post("/api/sessions", async (req, res) => {
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
  app2.patch("/api/sessions/:id", async (req, res) => {
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
  app2.get("/api/sessions/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const sessions = await storage.getSessionsByUser(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user sessions" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  process.env.HOST = process.env.HOST || "127.0.0.1";
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  const preferredHost = process.env.HOST || "127.0.0.1";
  server.on("error", (err) => {
    if (err && err.code === "ENOTSUP") {
      log(`address not supported (${preferredHost}), falling back to 0.0.0.0:${port}`);
      server.listen(port, "0.0.0.0", () => {
        log(`serving on port ${port} (0.0.0.0)`);
      });
      return;
    }
    throw err;
  });
  server.listen(port, preferredHost, () => {
    log(`serving on port ${port} (${preferredHost})`);
  });
})();
