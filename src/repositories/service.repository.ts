import { Prisma, PrismaClient } from "@prisma/client";

export class ServiceRepository {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
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

  async getAllServices() {
    return this.prismaClient.service.findMany({
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
      where: { clientId },
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

  async getServicesByCategory(categoria: string) {
    return this.prismaClient.service.findMany({
      where: { categoria: categoria as any },
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
