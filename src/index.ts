import "dotenv/config";
import express, { Request, Response } from "express";
import { connectDatabase } from "./config/database.js";

const app = express();
const port = process.env.PORT || 3000;

connectDatabase();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express + MongoDB!");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Server is running",
    database: "Connected to MongoDB",
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
