import { Prisma, PrismaClient } from "@prisma/client";

export class UserRepository {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.prismaClient.user.create({ data });
  }

  async getAllUsers() {
    return this.prismaClient.user.findMany({
      include: { clientData: true, providerData: true },
    });
  }

  async getUserByFirebaseUid(firebaseUid: string) {
    return this.prismaClient.user.findUnique({
      where: { firebaseUid },
      include: { clientData: true, providerData: true },
    });
  }
}
