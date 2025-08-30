import { Prisma, UserType } from "@prisma/client";
import { UserRepository } from "../repositories/user.repository";
import { auth } from "../config/firebase";

interface CreateUserInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  userType: UserType;
  data: any;
}

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(input: CreateUserInput) {
    const firebaseUser = await auth.createUser({
      email: input.email,
      password: input.password,
    });

    const userData: Prisma.UserCreateInput = {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      userType: input.userType,
      firebaseUid: firebaseUser.uid,
      ...(input.userType === "CLIENT"
        ? {
            clientData: {
              create: {
                street: input.data.street,
                houseNumber: input.data.houseNumber,
                reference: input.data.reference,
                neighborhood: input.data.neighborhood,
                city: input.data.city,
                state: input.data.state,
              },
            },
          }
        : {
            providerData: {
              create: {
                neighborhood: input.data.neighborhood,
                city: input.data.city,
                state: input.data.state,
                profession: input.data.profession,
              },
            },
          }),
    };

    return this.userRepository.createUser(userData);
  }

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }
}