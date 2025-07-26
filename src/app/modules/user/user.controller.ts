// src/modules/users/user.controller.ts
import { Request, Response } from "express";
import { userService } from "./user.service";
import { sendErrorResponse } from "../../../utils/sendErrorResponse";

export const userController = {
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const user = await userService.getProfile(userId!);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const updateData = req.body;
      const user = await userService.updateProfile(userId!, updateData);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      const user = await userService.updateUser(userId, updateData);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      await userService.deleteUser(userId);
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};
