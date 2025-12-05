import {Prisma, PrismaClient} from "@prisma/client";

export class ChatRepository {
    private static instance: ChatRepository;
    private prismaClient: PrismaClient;

    private constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
    }

    public static getInstance(prismaClient: PrismaClient): ChatRepository {
        if (!ChatRepository.instance) {
            ChatRepository.instance = new ChatRepository(prismaClient);
        }
        return ChatRepository.instance;
    }

    public async createRoom(data: Prisma.ChatRoomCreateInput) {
        return this.prismaClient.chatRoom.create({
            data
        });
    }

    async findRoomByUserPair(clientId: string, providerId: string) {
        return this.prismaClient.chatRoom.findFirst({
            where: {
                AND: [{clientId}, {providerId}]
            }
        });
    }


    public async saveMessage(data: Prisma.ChatMessageCreateInput) {
        return this.prismaClient.chatMessage.create({
            data
        });
    }
}