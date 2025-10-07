import {Prisma, PrismaClient, User} from "@prisma/client";

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

  /**
   * Get user profile information by user ID, including related clientData and providerData.
   * @param userId
   */
  async getUserProfileInformation(firebaseUid: any) {
    // return null;
    return this.prismaClient.user.findUnique({
      where: { firebaseUid: firebaseUid },
      include: { clientData: true, providerData: true },
    });
  }
}
