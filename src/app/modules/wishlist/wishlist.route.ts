import { Router } from "express";
import { WishlistController } from "./wishlist.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/add",
  authMiddleware(["user", "admin", "staff"]),
  WishlistController.addToWishlist
);
router.post(
  "/remove",
  authMiddleware(["user", "admin", "staff"]),
  WishlistController.removeFromWishlist
);
router.get(
  "/",
  authMiddleware(["user", "admin", "staff"]),
  WishlistController.getWishlist
);

export const WishlistRoutes = router;
