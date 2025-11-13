import {Prisma, UserType, City, State, PrismaClient, User} from "@prisma/client";
import { UserRepository } from "../repositories/user.repository";
import { auth } from "../config/firebase";
import {UserProfileDto} from "../types/UserProfileDto";

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  userType: UserType;
  city: string;
  neighborhood: string;
  state: string;
  data: any;
}
export class UserService {
    private static instance: UserService;
    private userRepository: UserRepository;

    private constructor(prismaClient: PrismaClient) {
      this.userRepository = UserRepository.getInstance(prismaClient);
    }

    public static getInstance(prismaClient: PrismaClient): UserService {
      if (!UserService.instance) {
        UserService.instance = new UserService(prismaClient);
      }
      return UserService.instance;
    }

    async createUser(input: CreateUserInput) {
      const firebaseUser = await auth.createUser({
        email: input.email,
        password: input.password,
      });

      const userData: Prisma.UserCreateInput = {
        firebaseUid: firebaseUser.uid,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        city: input.city as City,
        neighborhood: input.neighborhood,
        state: input.state as State,
        userType: input.userType,
        ...(input.userType === "CLIENT"
            ? {clientData: {create: {...input.data}}}
            : {providerData: {create: {profession: input.data.profession}}}),
      };

      return this.userRepository.createUser(userData);
    }

    async getAllUsers() {
      return this.userRepository.getAllUsers();
    }

    async getUserProfileInformation(uniqueIdentifier: any): Promise<UserProfileDto> {
      const user = await this.userRepository.getUserProfileInformation(uniqueIdentifier);

      if (!user) throw new Error("User not found");

      return this.mapPrismaUserToUserProfileDto(user);
    }

    async updateUserInformationByFirebaseUid(firebaseUid: string, updatedUserProfileData: UserProfileDto) {
        const updateInput = this.constructUpdateInput(this.mapUserProfileDtoToUserEntityType(updatedUserProfileData, "userData"));
        console.log('UPDATE INPUT:', updateInput);
        const updatedUser = await this.userRepository.updateUserInformationByFirebaseUid(firebaseUid, updateInput);
         return this.mapPrismaUserToUserProfileDto(updatedUser)
    }

    mapUserProfileDtoToUserEntityType(userProfileDto: UserProfileDto, propToRemove: string): Partial<Prisma.UserUpdateInput> {
        const { [propToRemove]: removed, ...newObj }: any = userProfileDto;
        if (removed !== undefined) {
            if (userProfileDto.userType === 'CLIENT') {
                newObj.clientData = removed;
            } else {
                newObj.providerData = removed;
            }
        }
        return newObj;
    }

    constructUpdateInput(partialUpdateInput: Partial<Prisma.UserUpdateInput>) {
        const updateInput: Prisma.UserUpdateInput = {
            ...partialUpdateInput,
        };

        if (partialUpdateInput.userType === "CLIENT" && partialUpdateInput.clientData) {
            updateInput.clientData = {
                update: {
                    ...partialUpdateInput.clientData,
                },
            };
        } else if (partialUpdateInput.userType === "PROVIDER" && partialUpdateInput.providerData) {
            updateInput.providerData = {
                update: {
                    ...partialUpdateInput.providerData,
                },
            };
        }

        return updateInput;
    }

    mapPrismaUserToUserProfileDto(user: any): UserProfileDto {
        return {
            id: user.id,
            city: user.city,
            state: user.state,
            firstName: user.firstName,
            lastName: user.lastName,
            neighborhood: user.neighborhood,
            phone: user.phone,
            picture: user.picture,
            userType: user.userType,
            userData: {
                street: user.userType === UserType.CLIENT ? user.clientData?.street : undefined,
                houseNumber: user.userType === UserType.CLIENT ? user.clientData?.houseNumber : undefined,
                reference: user.userType === UserType.CLIENT ? user.clientData?.reference : undefined,
                profession: user.userType === UserType.PROVIDER ? user.providerData?.profession : undefined
            },
            totalRating: user.totalRating,
            numberOfRatings: user.numberOfRatings,
            averageRating: user.averageRating,
        };
    }

  }