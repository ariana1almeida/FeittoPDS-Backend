import {Prisma, PrismaClient, Proposal} from "@prisma/client";

export class ProposalRepository{
    private static instance: ProposalRepository;
    private prismaClient: PrismaClient;

    private constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
    }

    public static getInstance(prismaClient: PrismaClient): ProposalRepository {
        if (!ProposalRepository.instance) {
            ProposalRepository.instance = new ProposalRepository(prismaClient);
        }
        return ProposalRepository.instance;
    }

    async createProposal(data: any) {
        return this.prismaClient.proposal.create({
            data
        });
    }

    async getAllProposals(serviceId: string): Promise<Proposal[]> {
        return this.prismaClient.proposal.findMany({
            where: { serviceId },
            orderBy: { accepted: 'desc' },
            include: {
                service: true,
                provider: {
                    include: {
                        providerData: true,
                    },
                },
            },
        });
    }

    async updateProposalStatus(proposalId: string, updatedProposal: Partial<Prisma.ProposalUpdateInput> ): Promise<Proposal> {
        return this.prismaClient.proposal.update({
            where: { id: proposalId },
            data: updatedProposal,
        });
    }

    async findProposalById(proposalId: string): Promise<Proposal | null> {
        return this.prismaClient.proposal.findUnique({
            where: { id: proposalId },
            include: { service: true, provider: true }
        });
    }

    getAllProposalsByProviderId(providerId: string) {
        return this.prismaClient.proposal.findMany({
            where: { providerId },
            include: {
                service: true,
                provider: {
                    include: {
                        providerData: true
                    }
                },
            }
        });
    }

    deleteProposal(proposalId: string) {
        return this.prismaClient.proposal.delete({
            where: {id: proposalId}
        });
    }

    deleteAllProposalsFromServiceOtherThanAccepted(serviceId: string) {
        return this.prismaClient.proposal.deleteMany({
            where: {
                serviceId,
                accepted: false
            }
        });
    }
}