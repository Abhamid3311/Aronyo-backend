"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
// src/modules/users/user.service.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("./user.model");
exports.userService = {
    async getProfile(userId) {
        const user = await user_model_1.User.findById(userId).select("-password");
        if (!user || user.isDeleted) {
            throw new Error("User not found");
        }
        return user;
    },
    async updateProfile(userId, updateData) {
        if (updateData.password) {
            updateData.password = await bcrypt_1.default.hash(updateData.password, 10);
        }
        const user = await user_model_1.User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        }).select("-password");
        if (!user || user.isDeleted) {
            throw new Error("User not found");
        }
        return user;
    },
    async getAllUsers() {
        return await user_model_1.User.find({ isDeleted: false });
    },
    async getSingleUser(userId) {
        const user = await user_model_1.User.findById(userId).select("-password"); // exclude password
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    },
    async updateUser(userId, updateData) {
        const user = await user_model_1.User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        }).select("-password");
        if (!user || user.isDeleted) {
            throw new Error("User not found");
        }
        return user;
    },
    async deleteUser(userId) {
        const user = await user_model_1.User.findByIdAndUpdate(userId, { isDeleted: true, status: "inactive" }, { new: true });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    },
    // Update password
    async updatePassword({ userId, currentPassword, newPassword, }) {
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        // Check current password
        const isMatch = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error("Current password is incorrect");
        }
        // Hash new password
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
    },
};
