import type { City, State, UserType } from "@prisma/client";
import type { UserDataDto } from "./UserDataDto";

export interface UserProfileDto {
    id: string
    city?: City;
    state?: State;
    firstName?: string;
    lastName?: string;
    neighborhood?: string;
    phone?: string;
    picture?: string;
    userType?: UserType;
    userData?: UserDataDto;
    totalRating?: number;
    numberOfRatings?: number;
    averageRating?: number;
    userAvatarPicture?: string;
}