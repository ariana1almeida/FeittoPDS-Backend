import { Request, Response } from "express";
import { prisma } from "../config/database";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";

const userService = new UserService(new UserRepository(prisma));

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, email, password, userType, data } = req.body;

    if (!firstName || !lastName || !phone || !email || !password || !userType || !data) {
      return res.status(400).json({ error: "All fields are required" });
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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
