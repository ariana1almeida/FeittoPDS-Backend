import { Request, Response } from "express";
import { prisma } from "../config/database";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import axios from "axios";

const userService = new UserService(new UserRepository(prisma));
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY as string;

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, email, password, userType, data } = req.body;

    if (!firstName || !lastName || !phone || !email || !password || !userType || !data) {
      return res.status(400).json({ error: "É necessário preencher todos os campos" });
    }

    const newUser = await userService.createUser({
      firstName,
      lastName,
      phone,
      email,
      password,
      userType,
      data,
    });

    return res.status(201).json(newUser);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "É necessário preencher todos os campos"});
        }
        console.log("FIREBASE_API_KEY:", FIREBASE_API_KEY);
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        );
        type FirebaseLoginResponse = {
            idToken: string;
            refreshToken: string;
            expiresIn: string;
            localId: string;
        };
        const { idToken, refreshToken, expiresIn, localId } = response.data as FirebaseLoginResponse;

        const user = await userService.getUserByFirebaseUid(localId);

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado no banco de dados" });
        }

        let redirectUrl;
        switch (user.userType) {
            case "CLIENT":
                redirectUrl = "/cliente/home";
                break;
            case "PROVIDER":
                redirectUrl = "/prestador/home";
                break;
            default:
                redirectUrl = "/";
        }

        return res.status(200).json({
            token: idToken,
            refreshToken,
            expiresIn,
            uid: localId,
            userType: user.userType,
            redirectUrl,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType
            }
        });
        }catch (error: any) {
        console.error(error.response?.data || error.message);
        return res.status(401).json({ error: "Email ou senha inválidos" });
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
