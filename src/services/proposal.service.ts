import { ProposalRepository } from "../repositories/proposal.repository";
import {PrismaClient} from "@prisma/client";

export interface CreateProposalInput {
    serviceId: string;
    providerId: string;
    estimatedPrice: number;
    estimatedDays: number;
    description: string;
}

export interface UpdateProposalInput {
    accepted?: boolean;
    estimatedPrice?: number;
    estimatedDays?: number;
    description?: string;
}

export class ProposalService {
    private static instance: ProposalService;
    private proposalRepository: ProposalRepository;

    private constructor(prisma: PrismaClient) {
        this.proposalRepository = ProposalRepository.getInstance(prisma);
    }

    public static getInstance(prisma: PrismaClient): ProposalService {
        if (!ProposalService.instance) {
            ProposalService.instance = new ProposalService(prisma);
        }
        return ProposalService.instance;
    }

    async getAllProposals(serviceId: string) {
        return this.proposalRepository.getAllProposals(serviceId);
    }

    async getAllProposalsByProviderId(providerId: string) {
        return this.proposalRepository.getAllProposalsByProviderId(providerId);
    }

    async createProposal(data: any) {
        return this.proposalRepository.createProposal(data);
    }

    async updateProposalStatus(proposalId: string, updatedFields: UpdateProposalInput) {
        const proposal = await this.proposalRepository.findProposalById(proposalId);
        if (!proposal) {
            throw new Error("Proposta não encontrada");
        }

        return this.proposalRepository.updateProposalStatus(proposalId, updatedFields);
    }


}