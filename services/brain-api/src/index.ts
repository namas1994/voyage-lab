import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import * as path from "path";
import { KnowledgeRouter } from "./routes/knowledge";

const envFiles = [
  path.resolve(__dirname, "../../../.env"), // Root .env
  path.resolve(__dirname, "../.env") // Root local overrides
];

// Load each env file if it exists
envFiles.forEach((file) => {
  dotenv.config({ path: file, override: true });
});

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    }
  })
);

app.use("/knowledge", express.json({ limit: "200kb" }), KnowledgeRouter);

// Basic endpoint
app.get("/", (_req, res) => {
  res
    .status(200)
    .json({
      message: "Welcome to the Brain API service!",
      timeStamp: new Date().toISOString()
    })
    .send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
