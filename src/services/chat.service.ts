import {PrismaClient} from "@prisma/client";
import {ChatRepository} from "../repositories/chat.repository";


export class ChatService {
    private static instance: ChatService;
    private chatRepository: ChatRepository

    private constructor(prismaClient: PrismaClient) {
        this.chatRepository = ChatRepository.getInstance(prismaClient);
    }

    public static getInstance(prismaClient: PrismaClient): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService(prismaClient);
        }
        return ChatService.instance;
    }

    async findOrCreateRoom(clientId: string, providerId: string) {
        let room = await this.chatRepository.findRoomByUserPair(clientId, providerId);
        if (!room) {
            room = await this.chatRepository.createRoom({
                client: {connect: {id: clientId}}, provider: {connect: {id: providerId}},
            });
        }
        return room;
    }

    async saveMessage(roomId: string, senderId: string, content: string) {
        return await this.chatRepository.saveMessage({
            senderId: senderId, content: content, chatRoomId: roomId
        });
    }

}
