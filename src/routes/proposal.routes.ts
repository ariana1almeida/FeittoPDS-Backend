import {Router} from "express";
import {
    createProposal,
    getAllProposals,
    getAllProposalsByProviderId,
    updateProposal
} from "../controllers/proposal.controller";

const router = Router();

router.get("/:serviceId", getAllProposals);
router.get("/provider/:providerId", getAllProposalsByProviderId);
router.put("/:proposalId", updateProposal);
router.post("/", createProposal);

export default router;