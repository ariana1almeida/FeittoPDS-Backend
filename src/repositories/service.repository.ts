import {Prisma, PrismaClient} from "@prisma/client";
export class ServiceRepository {
  private static instance: ServiceRepository;
  private prismaClient: PrismaClient;

  private constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public static getInstance(prismaClient: PrismaClient): ServiceRepository {
    if (!ServiceRepository.instance) {
      ServiceRepository.instance = new ServiceRepository(prismaClient);
    }
    return ServiceRepository.instance;
  }

  async createService(data: Prisma.ServiceCreateInput) {
    return this.prismaClient.service.create({
      data,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userType: true
          }
        }
      }
    });
  }

  async getAllServicesAvailableByProviderId(user: Prisma.UserGetPayload<{ include: { clientData: true, providerData: true } }>) {

    return this.prismaClient.service.findMany({
        where:{
            city: user.city,
            category: {
                in: user?.providerData?.professions
            }
        },
        include: {
            client: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    userType: true,
                    averageRating: true,
                    numberOfRatings: true,
                    neighborhood: true,
                    city: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
  }

  async getServiceById(id: string) {
    return this.prismaClient.service.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userType: true
          }
        }
      }
    });
  }

  async getServicesByClient(clientId: string) {
    return this.prismaClient.service.findMany({
      where: { clientId: clientId },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getServicesByCategory(category: string) {
    return this.prismaClient.service.findMany({
      where: { category: category as any },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async updateService(id: string, data: Prisma.ServiceUpdateInput) {
    return this.prismaClient.service.update({
      where: { id },
      data,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userType: true
          }
        }
      }
    });
  }

  async deleteService(id: string) {
    return this.prismaClient.service.delete({
      where: { id }
    });
  }
}