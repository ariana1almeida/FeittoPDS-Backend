import { Router } from "express";
import { login } from "../controllers/user.controller";

const router = Router();

router.post("/", login);
/*router.post('/forgot-password', forgotPassword);*/
/*router.post('/reset-password', resetPassword);*/

export default router;