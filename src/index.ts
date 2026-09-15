import express from "express";
import { subjectsRouter } from "./routes/subjects.route.js";
import cors from "cors";
import securityMiddleware from "./middleware/security.js";

const app = express();
const PORT = 8000;

// middelewares
app.use(express.json());
app.use(securityMiddleware)
app.use("/api/v1/subjects", subjectsRouter);

if(!process.env.FRONTEND_URL) {
   throw new Error("FRONTEND_URl is not set in .env file")
}
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  }),
);

// Root route
app.get("/", (req, res) => {
  res.send("Classroom backend is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
