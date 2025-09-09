"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../app/config"));
exports.tokenUtils = {
    generateTokens(userId, role) {
        // Access token
        const accessToken = jsonwebtoken_1.default.sign({ userId, role }, config_1.default.JWT_ACCESS_SECRET, { expiresIn: "15min" });
        // Refresh token
        const refreshToken = jsonwebtoken_1.default.sign({ userId, role }, config_1.default.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        return { accessToken, refreshToken };
    },
    generateAccessToken(userId, role) {
        return jsonwebtoken_1.default.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "1h",
        });
    },
    // Verify JWT Token
    verifyRefreshToken(refreshToken) {
        try {
            return jsonwebtoken_1.default.verify(refreshToken, config_1.default.JWT_REFRESH_SECRET);
        }
        catch (error) {
            console.log(error);
            throw new Error("Invalid refresh token");
        }
    },
};
