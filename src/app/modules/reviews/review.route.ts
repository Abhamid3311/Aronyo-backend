import { Router } from "express";
import { reviewController } from "./review.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Create or update review - only logged-in users
router.post(
  "/add-review",
  authMiddleware(["user", "admin"]),
  reviewController.createReview
);

// Get all reviews for a product
router.get("/product/:productId", reviewController.getProductReviews);
router.get("/", authMiddleware(["admin"]), reviewController.getAllReviews);
router.put("/:id", authMiddleware(["user"]), reviewController.updateReview);
router.delete(
  "/:id",
  authMiddleware(["user", "admin"]),
  reviewController.deleteReview
);

export const reviewRoutes = router;
