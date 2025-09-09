"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
const sendErrorResponse_1 = require("../../../utils/sendErrorResponse");
exports.userController = {
    async getProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const user = await user_service_1.userService.getProfile(userId);
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async updateProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const updateData = req.body;
            if (!updateData) {
                res
                    .status(400)
                    .json({ success: false, message: "No update data provided" });
            }
            const user = await user_service_1.userService.updateProfile(userId, updateData);
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getAllUsers(req, res) {
        try {
            const users = await user_service_1.userService.getAllUsers();
            res.status(200).json({ success: true, data: users });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getSingleUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await user_service_1.userService.getSingleUser(userId);
            res.status(200).json({ user });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            const user = await user_service_1.userService.updateUser(userId, updateData);
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            await user_service_1.userService.deleteUser(userId);
            res
                .status(200)
                .json({ success: true, message: "User deleted successfully" });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async updatePassword(req, res) {
        try {
            const userId = req.user.userId;
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }
            await user_service_1.userService.updatePassword({
                userId,
                currentPassword,
                newPassword,
            });
            res.status(200).json({ message: "Password updated successfully" });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
};
