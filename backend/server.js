import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import remedyRoutes from "./routes/remedy.route.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();
app.use(express.json()); // Accept JSON data in req.body

// API routes
app.use("/api/remedies", remedyRoutes);
console.log("Environment:", process.env.NODE_ENV);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "/frontend/dist");
  console.log("Serving static files from:", staticPath);
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  console.log("Running in development mode");
}

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at https://localhost:${PORT}`);
});
