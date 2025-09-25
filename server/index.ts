import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Prefer IPv4 by default to avoid ENOTSUP on platforms that do not support IPv6 ::1.
  // This ensures any code that reads process.env.HOST (possibly inside registerRoutes)
  // will default to 127.0.0.1 instead of ::1.
  process.env.HOST = process.env.HOST || "127.0.0.1";

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);

  // Prefer binding to a local IPv4 address; if the environment or platform
  // doesn't support the chosen address (e.g. ENOTSUP on IPv6 ::1), fall back
  // to all IPv4 interfaces.
  const preferredHost = process.env.HOST || "127.0.0.1";

  // If the server emits an ENOTSUP error while trying to bind (e.g. platform
  // doesn't support the chosen address family), try binding to 0.0.0.0 instead.
  server.on("error", (err: any) => {
    if (err && err.code === "ENOTSUP") {
      log(`address not supported (${preferredHost}), falling back to 0.0.0.0:${port}`);
      // Attempt to listen on all IPv4 interfaces
      server.listen(port, "0.0.0.0", () => {
        log(`serving on port ${port} (0.0.0.0)`);
      });
      return;
    }
    // rethrow other errors so they are not silently swallowed
    throw err;
  });

  // First attempt: bind to the preferred host (defaults to 127.0.0.1)
  server.listen(port, preferredHost, () => {
    log(`serving on port ${port} (${preferredHost})`);
  });
})();
