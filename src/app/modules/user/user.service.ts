// src/modules/users/user.service.ts
import bcrypt from "bcrypt";
import { User } from "./user.model";
import { IUpdatePasswordInput, IUser } from "./user.interface";

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
    return await User.find({ isDeleted: false });
  },

  async getSingleUser(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user || user.isDeleted) {
      throw new Error("User not found");
    }
    
    return user;
  },

  async deleteUser(userId: string): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true, status: "inactive" },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  // Update password
  async updatePassword({
    userId,
    currentPassword,
    newPassword,
  }: IUpdatePasswordInput): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();
  },
};
