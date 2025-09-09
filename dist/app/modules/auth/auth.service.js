"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../user/user.model");
const tokenUtils_1 = require("../../../utils/tokenUtils");
exports.authService = {
    // Register user
    async register(userData) {
        const existingUser = await user_model_1.User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("Email already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        const user = await user_model_1.User.create({ ...userData, password: hashedPassword });
        const { accessToken, refreshToken } = tokenUtils_1.tokenUtils.generateTokens(user._id.toString(), user.role);
        return { accessToken, refreshToken, user };
    },
    // Login user
    async login(email, password) {
        const user = await user_model_1.User.findOne({ email, isDeleted: false });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const { accessToken, refreshToken } = tokenUtils_1.tokenUtils.generateTokens(user._id.toString(), user.role);
        return { accessToken, refreshToken, user };
    },
    async refreshToken(refreshToken) {
        const decoded = tokenUtils_1.tokenUtils.verifyRefreshToken(refreshToken);
        const user = await user_model_1.User.findById(decoded.userId);
        if (!user || user.isDeleted) {
            throw new Error("Invalid refresh token");
        }
        const accessToken = tokenUtils_1.tokenUtils.generateAccessToken(user._id.toString(), user.role);
        return { accessToken, user };
    },
};
