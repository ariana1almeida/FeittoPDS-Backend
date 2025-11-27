import {prisma} from "../config/database";
import {RatingsService} from "../services/ratings.service";

const ratingsService = RatingsService.getInstance(prisma);

export const getRating = async (req: any, res: any) => {
    try {
        const {ratedById, ratedUserId} = req.params;

        if (!ratedById || !ratedUserId) {
            return res.status(400).json({error: "ratedById and ratedUserId are required"});
        }

        const rating = await ratingsService.getRating(ratedById, ratedUserId);
        if (!rating){
            return  res.status(404).json({error: "Rating not found for the given user pair, check the IDs and try again."});
        }
        return res.status(200).json(rating);
    }catch (e: any) {
        return res.status(500).json({error: e.message});
    }
}

export const createOrUpdateRating = async (req: any, res: any) => {
    try {
        const { ratedById, ratedUserId, score, comment, serviceId } = req.body;

        if (!ratedById || !ratedUserId || score === undefined) {
            return res.status(400).json({ error: "ratedById, ratedUserId and score are required" });
        }

        const rating = await ratingsService.createOrUpdateRating({ ratedById, ratedUserId, score, comment, serviceId });
        return res.status(200).json(rating);
    }catch (e:any) {
        return res.status(500).json({error: e.message});
    }
}
