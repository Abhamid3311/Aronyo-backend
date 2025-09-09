"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Create or update review - only logged-in users
router.post("/add-review", (0, auth_middleware_1.authMiddleware)(["user", "admin"]), review_controller_1.reviewController.createReview);
// Get all reviews for a product
router.get("/product/:productId", review_controller_1.reviewController.getProductReviews);
router.get("/", (0, auth_middleware_1.authMiddleware)(["admin"]), review_controller_1.reviewController.getAllReviews);
router.put("/:id", (0, auth_middleware_1.authMiddleware)(["user"]), review_controller_1.reviewController.updateReview);
router.delete("/:id", (0, auth_middleware_1.authMiddleware)(["user", "admin"]), review_controller_1.reviewController.deleteReview);
exports.reviewRoutes = router;
