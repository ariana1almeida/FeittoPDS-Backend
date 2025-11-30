import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectDatabase} from "./config/database";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import proposalRoutes from "./routes/proposal.routes";
import ratingsRoutes from "./routes/ratings.routes";
import serviceRoutes from "./routes/service.routes";
import { createServer } from 'node:http';
import { Server } from 'socket.io';


const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;


connectDatabase();

app.use(express.json({limit: "5mb"}));
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use("/users", userRoutes);
app.use("/login", authRoutes);
app.use("/proposal", proposalRoutes);
app.use("/ratings", ratingsRoutes)
app.use("/services", serviceRoutes);

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

const socketIo = new Server(server, {
    cors: { origin: ["http://localhost:5173"], credentials: true },
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

socketIo.on('connection', (socket) => {
    console.log('a user connected');
});

