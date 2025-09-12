import { Router } from "express";
import { reviewController } from "./review.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// User routes
router.post(
  "/add-review",
  authMiddleware(["user", "admin"]),
  reviewController.createReview
);

router.get(
  "/view-review/:id",
  authMiddleware(["user", "admin"]),
  reviewController.getSingleReview
);

router.put(
  "/edit-review/:id",
  authMiddleware(["user", "admin"]),
  reviewController.updateReview
);

router.delete(
  "/delete-review/:id",
  authMiddleware(["user", "admin"]),
  reviewController.deleteReview
);

// Admin only
router.put(
  "/update-status/:id",
  authMiddleware(["admin", "staff"]),
  reviewController.updateReviewStatus
);

// Random active reviews
router.get("/active-reviews", reviewController.getActiveReviews);

// Admin: all reviews
router.get(
  "/all-reviews",
  authMiddleware(["admin"]),
  reviewController.getAllReviews
);

export const reviewRoutes = router;
