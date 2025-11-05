import {Profession} from "@prisma/client";

export interface CreateServiceInput {
    picture: string;
    title: string;
    description: string;
    category: Profession;
    firebaseUid: string;
}