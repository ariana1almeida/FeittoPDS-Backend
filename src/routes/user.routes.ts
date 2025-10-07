import { Router } from "express";
import { createUser, getAllUsers, getProfile } from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getProfile)

export default router;
