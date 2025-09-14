"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// User routes
router.post("/add-review", (0, auth_middleware_1.authMiddleware)(["user", "admin", "staff"]), review_controller_1.reviewController.createReview);
router.delete("/delete-review/:id", (0, auth_middleware_1.authMiddleware)(["user", "admin"]), review_controller_1.reviewController.deleteReview);
// Admin only
router.put("/update-status/:id", (0, auth_middleware_1.authMiddleware)(["admin", "staff"]), review_controller_1.reviewController.updateReviewStatus);
// Random active reviews
router.get("/active-reviews", review_controller_1.reviewController.getActiveReviews);
// Admin: all reviews
router.get("/all-reviews", (0, auth_middleware_1.authMiddleware)(["admin"]), review_controller_1.reviewController.getAllReviews);
exports.reviewRoutes = router;
