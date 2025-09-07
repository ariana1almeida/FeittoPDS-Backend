import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);

    (req as any).user = decodedToken;

    next();
  } catch (error) {
    console.error("Firebase auth error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
