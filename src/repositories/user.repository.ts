import {Prisma, PrismaClient, User} from "@prisma/client";

export class UserRepository {
    private static instance: UserRepository;
    private prismaClient: PrismaClient;

    private constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
    }

    static getInstance(prismaClient: PrismaClient): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository(prismaClient);
        }
        return UserRepository.instance;
    }

    async createUser(data: Prisma.UserCreateInput) {
        return this.prismaClient.user.create({ data });
    }

    async getAllUsers() {
        return this.prismaClient.user.findMany({
            include: { clientData: true, providerData: true },
        });
    }

    /**
     * Get user profile information by user ID, including related clientData and providerData.
     * @param userId
     */
    async getUserProfileInformation(firebaseUid: any) {
        return this.prismaClient.user.findUnique({
            where: { firebaseUid: firebaseUid },
            include: { clientData: true, providerData: true },
        });
    }

    async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
        const user = this.prismaClient.user.findUnique({
            where: { firebaseUid: firebaseUid },
        });

        if (!user){
            throw new Error("Usuário não encontrado");
        }

        return user;
    }
}
