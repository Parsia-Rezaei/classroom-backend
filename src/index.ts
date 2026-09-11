import express from "express";
import { subjectsRouter } from "./routes/subjects.route.js";
import cors from "cors";

const app = express();
const PORT = 8000;

// JSON middleware

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/subjects", subjectsRouter);
if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URl is not set in .env file");
}

// Root route
app.get("/", (req, res) => {
  res.send("Classroom backend is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
