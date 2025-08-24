/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendErrorResponse } from "../../../utils/sendErrorResponse";

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const userData = req.body;
      const result = await authService.register(userData);
      setCookie(res, result);

      res.status(201).json({
        success: true,
        messgae: "User Registered Succefully!",
        data: { accessToken: result.accessToken, user: result.user },
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      setCookie(res, result);

      res.status(200).json({
        success: true,
        data: { accessToken: result.accessToken, user: result.user },
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("refreshToken");

      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: "Refresh token not found",
        });
      }

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: { accessToken: result.accessToken, user: result.user },
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};

// Set Cookie for Register & Login
const setCookie = (res: Response, result: any) => {
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // false on localhost
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
