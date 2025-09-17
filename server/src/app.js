import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import customersRouter from "./routes/customers.js";

const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get("/api/healthz", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/customers", customersRouter);

// ✅ הגשת ה־dashboard בפרודקשן
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDist));

  app.get("/api/dashboard", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

export default app;
