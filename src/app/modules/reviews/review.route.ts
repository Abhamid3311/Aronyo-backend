import { Router } from "express";
import { reviewController } from "./review.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Create or update review - only logged-in users
router.post("/create-review", authMiddleware(["user"]), reviewController.createReview);

// Get all reviews for a product
router.get("/product/:productId", reviewController.getProductReviews);

// Update review by id - user must be authenticated
router.put("/:id", authMiddleware(["user"]), reviewController.updateReview);

// Delete review by id - user must be authenticated
router.delete("/:id", authMiddleware(["user","admin"]), reviewController.deleteReview);

export const reviewRoutes = router;;

