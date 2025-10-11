import {Prisma, PrismaClient, Profession, ServiceStatus} from "@prisma/client";
import {ServiceRepository} from "../repositories/service.repository";
import {UserRepository} from "../repositories/user.repository";
import {CreateServiceInput} from "../types/CreateServiceInput";
//TODO validar se os metodos daqui estão sendo utilizados e estão corretos
export class ServiceService {
    private static instance: ServiceService;
    private serviceRepository: ServiceRepository;
    private userRepository: UserRepository;

    private constructor(prisma: PrismaClient) {
        this.serviceRepository = ServiceRepository.getInstance(prisma);
        this.userRepository = UserRepository.getInstance(prisma);
    }

    public static getInstance(prisma: PrismaClient): ServiceService {
        if (!ServiceService.instance) {
            ServiceService.instance = new ServiceService(prisma);
        }
        return ServiceService.instance;
    }

    async createService(input: CreateServiceInput) {
        const user = await this.userRepository.getUserByFirebaseUid(input.firebaseUid);

        const serviceData: Prisma.ServiceCreateInput = {
            picture: input.picture,
            title: input.title,
            description: input.description,
            category: input.category,
            status: ServiceStatus.OPEN,
            client: {
                connect: {id: user?.id}
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

    async getServicesByClient(firebaseUid: string) {
        const user = await this.userRepository.getUserByFirebaseUid(firebaseUid);
        // @ts-ignore
        return this.serviceRepository.getServicesByClient(user.id);
    }

    async getServicesByCategory(categoria: Profession) {
        return this.serviceRepository.getServicesByCategory(categoria);
    }

    async updateServiceStatus(id: string, status: ServiceStatus) {
        return this.serviceRepository.updateService(id, {status});
    }

    async updateService(id: string, input: Partial<CreateServiceInput>) {
        const updateData: Prisma.ServiceUpdateInput = {};

        if (input.picture) updateData.picture = input.picture;
        if (input.title) updateData.title = input.title;
        if (input.description) updateData.description = input.description;
        if (input.category) updateData.category = input.category;

        return this.serviceRepository.updateService(id, updateData);
    }

    async deleteService(id: string) {
        return this.serviceRepository.deleteService(id);
    }
}
