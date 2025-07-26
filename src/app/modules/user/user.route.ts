import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/profile",
  authMiddleware(["user", "admin", "staff"]),
  userController.getProfile
);

router.put(
  "/profile",
  authMiddleware(["user", "admin", "staff"]),
  userController.updateProfile
);

// Admin-only routes
router.get("/", authMiddleware(["admin"]), userController.getAllUsers);
router.patch("/:id", authMiddleware(["admin"]), userController.updateUser);
router.delete("/:id", authMiddleware(["admin"]), userController.deleteUser);

export const userRoutes = router;
