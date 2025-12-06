import {Router} from "express";
import {createOrUpdateRating, getAllRatingsFromCurrentUser, getRating} from "../controllers/ratings.controller";


const router = Router();

router.get("/:ratedById/:ratedUserId", getRating);
router.get("/:ratedUserId", getAllRatingsFromCurrentUser);
router.put("/", createOrUpdateRating);

export default router;