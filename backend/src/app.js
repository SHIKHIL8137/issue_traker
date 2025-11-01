import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import { applySecurityMiddlewares } from "./middleware/securityMiddleware.js";
import AuthRoute from "./routes/auth.js";
import IssueRoute from "./routes/issues.js";
import DashboardRoute from "./routes/dashboard.js";
import UserRoute from "./routes/users.js";
import CommentRoute from "./routes/comments.js";
import AuditRoute from "./routes/audit.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();

  // Security + CORS
  applySecurityMiddlewares(app);

  // Utilities
  app.use(compression({ threshold: 1024 }));
  app.use(express.json({ limit: "200kb" }));
  app.use(cookieParser());
  app.use(morgan("dev"));

  app.get("/", (req, res) => {
    res.send({ status: "ok", message: "issue Tracker API" });
  });

  app.use("/api/auth", AuthRoute);
  app.use("/api/issue", IssueRoute);
  app.use("/api/dashboard", DashboardRoute);
  app.use("/api/users", UserRoute);
  app.use("/api/comment", CommentRoute);
  app.use("/api/audit", AuditRoute);

  app.use(errorHandler);

  return app;
};