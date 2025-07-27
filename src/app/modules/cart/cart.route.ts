import { Router } from "express";
import { cartController } from "./cart.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware(["user", "admin", "staff"]),
  cartController.getCart
);
router.post(
  "/add",
  authMiddleware(["user", "admin", "staff"]),
  cartController.addToCart
);
router.patch(
  "/increase",
  authMiddleware(["user", "admin", "staff"]),
  cartController.increaseQuantity
);
router.patch(
  "/decrease",
  authMiddleware(["user", "admin", "staff"]),
  cartController.decreaseQuantity
);
router.delete(
  "/remove",
  authMiddleware(["user", "admin", "staff"]),
  cartController.removeItem
);
router.delete(
  "/",
  authMiddleware(["user", "admin", "staff"]),
  cartController.clearCart
);

export const cartRoutes = router;
