import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";

export const applySecurityMiddlewares = (app) => {
  // Trust proxy for production
  app.set("trust proxy", process.env.NODE_ENV === 'production' ? 1 : false);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  app.use(hpp());

  app.use(mongoSanitize());

  const allowedOrigins = [
    process.env.FRONTEND_URL, 
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:80",
    "http://localhost",
    "https://issue-traker-pcj9.onrender.com" // Add your Render frontend URL
  ].filter(Boolean);

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
          return callback(null, true);
        } else {
          return callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Authorization"]
    })
  );
  app.options(/.*/, cors());
};