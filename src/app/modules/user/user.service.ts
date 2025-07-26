// src/modules/users/user.service.ts
import bcrypt from "bcrypt";
import { User } from "./user.model";
import { IUser } from "./user.interface";

export const userService = {
  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId).select("-password");

    if (!user || user.isDeleted) {
      throw new Error("User not found");
    }
    return user;
  },

  async updateProfile(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser> {

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
    
    if (!user || user.isDeleted) {
      throw new Error("User not found");
    }
    return user;
  },

  async getAllUsers(): Promise<IUser[]> {
    return await User.find({ isDeleted: false }).select("-password");
  },

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user || user.isDeleted) {
      throw new Error("User not found");
    }
    return user;
  },

  async deleteUser(userId: string): Promise<void> {
    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    if (!user) {
      throw new Error("User not found");
    }
  },
};
