import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import { authRouter } from "./routes/auth.js";
import { productsRouter } from "./routes/products.js";
import { seedDashboardAdminIfEnabled } from "./seedDashboardAdmin.js";

const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce";

const app = express();
app.use(cors());
const jsonLimit = process.env.JSON_BODY_LIMIT || "50mb";
app.use(express.json({ limit: jsonLimit }));
app.use(express.urlencoded({ extended: true, limit: jsonLimit }));
console.log("JSON body limit:", jsonLimit);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);

async function main() {
  await connectDb(MONGODB_URI);
  await seedDashboardAdminIfEnabled();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
