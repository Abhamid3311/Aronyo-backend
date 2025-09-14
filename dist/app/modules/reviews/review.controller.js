"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const review_service_1 = require("./review.service");
const sendErrorResponse_1 = require("../../../utils/sendErrorResponse");
exports.reviewController = {
    async createReview(req, res) {
        try {
            const userId = req.user.userId;
            const { orderId, rating, comment } = req.body;
            const review = await review_service_1.reviewService.createOrUpdateReview(userId, orderId, rating, comment);
            res.status(201).json({
                success: true,
                data: review,
                message: "Review saved successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getActiveReviews(req, res) {
        try {
            const reviews = await review_service_1.reviewService.getAllActiveReviews();
            res.status(200).json({ success: true, data: reviews });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getAllReviews(req, res) {
        try {
            const reviews = await review_service_1.reviewService.getAllReviews();
            res.status(200).json({ success: true, data: reviews });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async deleteReview(req, res) {
        try {
            const reviewId = req.params.id;
            await review_service_1.reviewService.deleteReview(reviewId);
            res.status(200).json({
                success: true,
                message: "Review deleted successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    // Admin only
    async updateReviewStatus(req, res) {
        try {
            const reviewId = req.params.id;
            const { isActive } = req.body;
            const updatedReview = await review_service_1.reviewService.updateReviewStatus(reviewId, isActive);
            if (!updatedReview) {
                return res
                    .status(404)
                    .json({ success: false, message: "Review not found" });
            }
            res.status(200).json({
                success: true,
                data: updatedReview,
                message: `Review status updated to ${isActive ? "Active" : "Inactive"}`,
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
};
