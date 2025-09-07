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
  "/profile",
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
  "/admin/update/:id",
  authMiddleware(["admin"]),
  userController.updateUser
);
router.delete("/:id", authMiddleware(["admin"]), userController.deleteUser);
router.get("/:id", authMiddleware(["admin"]), userController.getSingleUser);

export const userRoutes = router;
