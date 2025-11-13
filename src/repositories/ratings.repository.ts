import {Prisma, PrismaClient} from "@prisma/client";

export class RatingsRepository{
    private static instance: RatingsRepository;
    private prismaClient: PrismaClient;

    private constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;
    }

    public static getInstance(prismaClient: PrismaClient): RatingsRepository {
        if (!RatingsRepository.instance) {
            RatingsRepository.instance = new RatingsRepository(prismaClient);
        }
        return RatingsRepository.instance;
    }

    async findByPair(ratedById: string, ratedUserId: string) {
        return this.prismaClient.ratings.findUnique({
            where: {
                ratedById_ratedUserId: { ratedById, ratedUserId },
            },
        });
    }

    async createOrUpdateRating(ratingData: Prisma.RatingsUpsertArgs) {
        return this.prismaClient.ratings.upsert(ratingData);
    }

}