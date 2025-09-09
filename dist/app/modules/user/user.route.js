"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// User / My Profile
router.get("/me", (0, auth_middleware_1.authMiddleware)(["user", "admin", "staff"]), user_controller_1.userController.getProfile);
router.put("/update-profile", (0, auth_middleware_1.authMiddleware)(["user", "admin", "staff"]), user_controller_1.userController.updateProfile);
router.patch("/update-password", (0, auth_middleware_1.authMiddleware)(["user", "admin", "staff"]), user_controller_1.userController.updatePassword);
// Admin-only routes
router.get("/admin/all-users", (0, auth_middleware_1.authMiddleware)(["admin"]), user_controller_1.userController.getAllUsers);
router.put("/admin/update-user/:id", (0, auth_middleware_1.authMiddleware)(["admin"]), user_controller_1.userController.updateUser);
router.delete("/delete-user/:id", (0, auth_middleware_1.authMiddleware)(["admin"]), user_controller_1.userController.deleteUser);
router.get("/admin/:id", (0, auth_middleware_1.authMiddleware)(["admin"]), user_controller_1.userController.getSingleUser);
exports.userRoutes = router;
