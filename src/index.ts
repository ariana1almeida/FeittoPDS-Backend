import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectDatabase} from "./config/database";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

const app = express();
const port = process.env.PORT || 3000;

connectDatabase();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use("/users", userRoutes);
app.use("/login", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express + Prisma!");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Server is running",
    database: "Connected to MongoDB via Prisma",
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
