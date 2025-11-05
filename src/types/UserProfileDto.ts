import type { City, State, UserType } from "@prisma/client";
import type { UserDataDto } from "./UserDataDto";

export interface UserProfileDto {
    city?: City;
    state?: State;
    firstName?: string;
    lastName?: string;
    neighborhood?: string;
    phone?: string;
    userType?: UserType;
    userData?: UserDataDto;
}