import { Prisma, Profession, ServiceStatus } from "@prisma/client";
import { ServiceRepository } from "../repositories/service.repository";

interface CreateServiceInput {
  foto: string;
  titulo: string;
  descricao: string;
  categoria: Profession;
  clientId: string;
}

export class ServiceService {
  private serviceRepository: ServiceRepository;

  constructor(serviceRepository: ServiceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async createService(input: CreateServiceInput) {
    const serviceData: Prisma.ServiceCreateInput = {
      foto: input.foto,
      titulo: input.titulo,
      descricao: input.descricao,
      categoria: input.categoria,
      status: ServiceStatus.OPEN,
      client: {
        connect: { id: input.clientId }
      }
    };

    return this.serviceRepository.createService(serviceData);
  }

  async getAllServices() {
    return this.serviceRepository.getAllServices();
  }

  async getServiceById(id: string) {
    return this.serviceRepository.getServiceById(id);
  }

  async getServicesByClient(clientId: string) {
    return this.serviceRepository.getServicesByClient(clientId);
  }

  async getServicesByCategory(categoria: Profession) {
    return this.serviceRepository.getServicesByCategory(categoria);
  }

  async updateServiceStatus(id: string, status: ServiceStatus) {
    return this.serviceRepository.updateService(id, { status });
  }

  async updateService(id: string, input: Partial<CreateServiceInput>) {
    const updateData: Prisma.ServiceUpdateInput = {};

    if (input.foto) updateData.foto = input.foto;
    if (input.titulo) updateData.titulo = input.titulo;
    if (input.descricao) updateData.descricao = input.descricao;
    if (input.categoria) updateData.categoria = input.categoria;

    return this.serviceRepository.updateService(id, updateData);
  }

  async deleteService(id: string) {
    return this.serviceRepository.deleteService(id);
  }
}
