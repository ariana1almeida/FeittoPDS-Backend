import "dotenv/config";
import express, {Request, Response} from "express";
import cors from "cors";
import {connectDatabase} from "./config/database";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import proposalRoutes from "./routes/proposal.routes";
import ratingsRoutes from "./routes/ratings.routes";
import serviceRoutes from "./routes/service.routes";
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import {prisma} from "./config/database";
import {ChatService} from "./services/chat.service";

const chatService = ChatService.getInstance(prisma);


const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;


connectDatabase();

app.use(express.json({limit: "5mb"}));
app.use(cors({origin: ["http://localhost:5173"], credentials: true}));

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
        status: "OK", message: "Server is running", database: "Connected to MongoDB via Prisma",
    });
});

const socketIo = new Server(server, {
    cors: {origin: ["http://localhost:5173"], credentials: true},
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

socketIo.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    // Handler para entrar em rooms
    socket.on('chat:join', async (payload: { users: object }) => {
        console.log('Payload', payload);

        const room = await chatService.findOrCreateRoom(payload.users?.clientId, payload.users?.providerId);

        socket.join(room.id);
        console.log(`Socket ${socket.id} joined room ${room.id}`);

        // Opcional: ACK para o cliente, confirmando a entrada na sala
        socket.emit('chat:joined', {room: room.id});
    });

    // Handler canônico para envio de mensagens (room-based)
    socket.on('chat:send', (payload: { room?: string; text?: string; from?: string }) => {
        console.log('Message received on chat:send:', payload);

        if (!payload || typeof payload.text !== 'string' || !payload.room) {
            console.warn('chat:send missing fields:', payload);
            return;
        }

        // chatService.saveMessage(payload.room.id, payload.users.);
        // Cria a mensagem mínima que o frontend espera
        const msg = {
            id: Date.now().toString(), // id simples, substitua por uuid se quiser
            room: payload.room, from: payload.from ?? 'anon', text: payload.text, timestamp: Date.now(),
        };

        // Emite para todos no room (inclui o emissor)
        socketIo.to(payload.room).emit('chat:message', msg);
    });

    // Compat layer: aceitar o evento 'message' do cliente atual e tratá-lo como chat:send
    socket.on('message', (data: any) => {
        console.log("Legacy 'message' received:", data);
        // se vier com room, trate como chat:send no room; senão faz broadcast global (como antes)
        if (data?.room) {
            const msg = {
                id: Date.now().toString(),
                room: data.room,
                from: data.from ?? 'anon',
                text: data.text ?? '',
                timestamp: Date.now(),
            };
            socketIo.to(data.room).emit('chat:message', msg);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected', socket.id);
    });
});