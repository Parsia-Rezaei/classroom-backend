import express from "express";
import { subjectsRouter } from "./routes/subjects.route.js";
import cors from "cors";

const app = express();
const PORT = 8000;

// JSON middleware
app.use(express.json());
app.use("/api/v1/subjects", subjectsRouter);
app.use(
  cors({
    origin: process.env.FONTEND_URL,
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
