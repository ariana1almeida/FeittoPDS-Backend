import { PrismaClient } from "@prisma/client";
import {UserRepository} from "../repositories/user.repository";
import {RatingsRepository} from "../repositories/ratings.repository";

interface CreateOrUpdateRatingInput {
    ratedById: string;
    ratedUserId: string;
    score: number;
    comment: string;
    serviceId?: string;
}

export class RatingsService {
    private static instance: RatingsService;
    private ratingsRepository: RatingsRepository;
    private userRepository: UserRepository;
    private prisma: PrismaClient;

    private constructor(prisma: PrismaClient) {
        this.userRepository = UserRepository.getInstance(prisma);
        this.ratingsRepository = RatingsRepository.getInstance(prisma);
        this.prisma = prisma;
    }

    public static getInstance(prisma: PrismaClient): RatingsService {
        if (!RatingsService.instance) {
            RatingsService.instance = new RatingsService(prisma);
        }
        return RatingsService.instance;
    }

    async createOrUpdateRating(input: CreateOrUpdateRatingInput) {
        const { ratedById, ratedUserId, score, comment, serviceId } = input;

        return this.prisma.$transaction(async (tx) => {
            const existing = await this.ratingsRepository.findByPair(ratedById, ratedUserId);
            const rating = await this.ratingsRepository.createOrUpdateRating({
                where: {
                    ratedById_ratedUserId: { ratedById, ratedUserId },
                },
                create: { ratedById, ratedUserId, score, comment, serviceId },
                update: { score, comment },
            });

            const ratedUser = await this.userRepository.findById(ratedUserId);
            if (!ratedUser) throw new Error("Rated user not found");

            let { totalRating, numberOfRatings } = ratedUser;

            if (existing) {
                totalRating += score - existing.score;
            } else {
                totalRating += score;
                numberOfRatings++;
            }

            const average = totalRating / numberOfRatings;

            await this.userRepository.updateRatingsSummary(ratedUserId, totalRating, numberOfRatings, average);

            return rating;
        });
    }

    async getRating(ratedById: string, ratedUserId: string) {
        return await this.ratingsRepository.findByPair(ratedById, ratedUserId);
    }

    async getAllRatingsFromCurrentUser(ratedUserId: string) {
        return this.ratingsRepository.getAllRatingsFromCurrentUser(ratedUserId);
    }
}
