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
      // ✅ Read accessToken from cookies
      const token = req.cookies.accessToken;
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Access token not found. Please login.",
        });
      }

      // ✅ Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as { userId: string; role: string };

      // ✅ Check allowed roles
      if (!allowedRoles.includes(decoded.role)) {
        res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      // ✅ Attach user to request
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }
  };
};
