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
    async getUserProfileInformation(id: any) {
        return this.prismaClient.user.findUnique({
            where: { id: id },
            include: { clientData: true, providerData: true },
        });
    }

    async getUserProfileInformationByFirebaseUid(firebaseUid: any) {
        return this.prismaClient.user.findUnique({
            where: { firebaseUid: firebaseUid },
            include: { clientData: true, providerData: true },
        });
    }

    async getUserById(firebaseUid: string): Promise<User | null> {
        const user = this.prismaClient.user.findUnique({
            where: { firebaseUid: firebaseUid },
            include: { clientData: true, providerData: true },
        })

        if (!user){
            throw new Error("Usuário não encontrado");
        }

        return user;
    }

    async updateUserInformationById(id: string, updateInput: Partial<Prisma.UserUpdateInput>) {
        return this.prismaClient.user.update({
            where: { id: id },
            include: { clientData: true, providerData: true },
            data: updateInput,
        });
    }

    async findById(id: string) {
        return this.prismaClient.user.findUnique({
            where: { id },
            select: {
                totalRating: true,
                numberOfRatings: true,
            },
        });
    }

    async updateRatingsSummary(id: string, totalRating: number, numberOfRatings: number, averageRating: number) {
        return this.prismaClient.user.update({
            where: { id },
            data: { totalRating, numberOfRatings, averageRating },
        });
    }
}
