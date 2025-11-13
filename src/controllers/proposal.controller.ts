import {CreateProposalInput, ProposalService, UpdateProposalInput} from "../services/proposal.service";
import {prisma} from "../config/database";

const proposalService = ProposalService.getInstance(prisma);

export const getAllProposals = async (req: any, res: any) => {
    try {
        const {serviceId} = req.params;

        if (!serviceId) {
            return res.status(400).json({error: "ID do serviço é obrigatório"});
        }

        const proposals = await proposalService.getAllProposals(serviceId);
        return res.json(proposals);
    }catch (e:any) {
        return res.status(500).json({error: e.message});
    }
}

export const getAllProposalsByProviderId = async (req: any, res: any) => {
    try {
        const {providerId} = req.params;

        if (!providerId) {
            return res.status(400).json({error: "ID do prestador é obrigatório"});
        }

        const proposals = await proposalService.getAllProposalsByProviderId(providerId);
        return res.json(proposals);
    }catch (e:any) {
        return res.status(500).json({error: e.message});
    }
}

export const createProposal = async (req: any, res: any) => {
    try {
        const data: CreateProposalInput = req.body;

        if (!data) {
            return res.status(400).json({error: "Dados da proposta são obrigatórios"});
        }

        const newProposal = await proposalService.createProposal(data);
        return res.status(201).json(newProposal);
    }catch (e:any) {
        return res.status(500).json({error: e.message});
    }
}

export const updateProposal = async (req: any, res: any) => {
    try {
        const {proposalId} = req.params;
        const updatedFields:UpdateProposalInput = req.body;

        if (!proposalId || !updatedFields) {
            return res.status(400).json({error: "ID da proposta e campos atualizados são obrigatórios"});
        }

        const update = await proposalService.updateProposalStatus(proposalId, updatedFields);
        return res.status(200).json(update);
    }catch (e:any) {
        return res.status(500).json({error: e.message});
    }
}