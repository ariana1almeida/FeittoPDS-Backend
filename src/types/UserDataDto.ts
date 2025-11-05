import {Profession} from "@prisma/client";

export interface UserDataDto {
    street?: string;
    houseNumber?: number;
    reference?: string;
    profession?: Profession;
}