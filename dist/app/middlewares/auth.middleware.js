"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Read token from cookies
            const token = req.cookies?.accessToken;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: "Access token not found. Please login.",
                });
                return;
            }
            // Verify token
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
            }
            catch (err) {
                console.error("JWT verification failed:", err);
                res.status(401).json({
                    success: false,
                    message: "Invalid or expired access token",
                });
                return;
            }
            // Check roles
            if (!allowedRoles.includes(decoded.role)) {
                res.status(403).json({
                    success: false,
                    message: "Unauthorized access",
                });
                return;
            }
            // Attach user to request and continue
            req.user = decoded;
            next();
        }
        catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(500).json({
                success: false,
                message: "Server error in auth middleware",
            });
        }
    };
};
exports.authMiddleware = authMiddleware;
