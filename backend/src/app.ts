import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import questionRoutes from "./routes/question.routes.js";
import voteRoutes from "./routes/vote.routes.js";
import stanceRoutes from "./routes/stance.routes.js";

// Initialize Express application
const app = express();

// Enable CORS and JSON parsing for incoming requests
app.use(cors());
app.use(express.json());

// Set up API routes for health checks and session management
app.get("/", (req, res) => {
  res.send("Welcome to the AQNAENI API :)");
});

app.use("/api/health", healthRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/stances", stanceRoutes);

export default app;