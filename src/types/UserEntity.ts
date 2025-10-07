import { UserType } from "@prisma/client";

export interface UserEntity {
    id: string;
    firebaseUid: string;
    firstName: string;
    lastName: string;
    phone: string;
    neighborhood: string;
    city: string;
    state: string;
    userType: UserType;
    clientData?: ClientDataEntity;
    providerData?: ProviderDataEntity;
}

export interface ClientDataEntity {
    id: string;
    street: string;
    houseNumber: number;
    reference: string;
    userId: string;
}

export interface ProviderDataEntity {
    id: string;
    profession: string;
    userId: string;
}