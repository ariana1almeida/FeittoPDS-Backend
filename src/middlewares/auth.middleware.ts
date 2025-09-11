import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);

    (req as any).user = decodedToken;

    next();
  } catch (error) {
    console.error("Erro de autenticação Firebase:", error);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
