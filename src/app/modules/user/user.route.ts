import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// User / My Profile
router.get(
  "/me",
  authMiddleware(["user", "admin", "staff"]),
  userController.getProfile
);

router.put(
  "/update-profile",
  authMiddleware(["user", "admin", "staff"]),
  userController.updateProfile
);

router.patch(
  "/update-password",
  authMiddleware(["user", "admin", "staff"]),
  userController.updatePassword
);

// Admin-only routes
router.get(
  "/admin/all-users",
  authMiddleware(["admin"]),
  userController.getAllUsers
);

router.put(
  "/admin/update-user/:id",
  authMiddleware(["admin"]),
  userController.updateUser
);

router.delete("/delete-user/:id", authMiddleware(["admin"]), userController.deleteUser);

router.get("/admin/:id", authMiddleware(["admin"]), userController.getSingleUser);

export const userRoutes = router;
