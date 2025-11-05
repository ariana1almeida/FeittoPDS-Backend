import { Router } from "express";
import {createUser, getAllUsers, getProfile, updateProfile} from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getProfile)
router.put("/:id", updateProfile)

export default router;
