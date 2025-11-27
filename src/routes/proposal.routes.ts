import {Router} from "express";
import {
    createProposal, deleteProposal,
    getAllProposals,
    getAllProposalsByProviderId,
    updateProposal,
    deleteAllProposalsFromServiceOtherThanAccepted
} from "../controllers/proposal.controller";

const router = Router();

router.get("/:serviceId", getAllProposals);
router.get("/provider/:providerId", getAllProposalsByProviderId);
router.put("/:proposalId", updateProposal);
router.delete("/:proposalId", deleteProposal);
router.delete("/service/:serviceId", deleteAllProposalsFromServiceOtherThanAccepted);
router.post("/", createProposal);

export default router;