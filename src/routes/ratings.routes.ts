import {Router} from "express";
import {createOrUpdateRating, getRating} from "../controllers/ratings.controller";


const router = Router();

router.get("/:ratedById/:ratedUserId", getRating);
router.put("/", createOrUpdateRating);

export default router;