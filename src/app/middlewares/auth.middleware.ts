import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: { userId: string; role: string };
}

export const authMiddleware = (allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ success: false, message: "No token provided" });
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as {
        userId: string;
        role: string;
      };

      if (!allowedRoles.includes(decoded.role)) {
        res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
};
