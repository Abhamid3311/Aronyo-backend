"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const review_service_1 = require("./review.service");
const sendErrorResponse_1 = require("../../../utils/sendErrorResponse");
exports.reviewController = {
    async createReview(req, res) {
        try {
            const userId = req.user.userId;
            const { productId, rating, comment } = req.body;
            const review = await review_service_1.reviewService.createOrUpdateReview(userId, productId, rating, comment);
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
    async getProductReviews(req, res) {
        try {
            const productId = req.params.productId;
            const reviews = await review_service_1.reviewService.getReviewsByProduct(productId);
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
    async updateReview(req, res) {
        try {
            const reviewId = req.params.id;
            const updateData = req.body;
            const updatedReview = await review_service_1.reviewService.updateReview(reviewId, updateData);
            if (!updatedReview) {
                res.status(404).json({ success: false, message: "Review not found" });
            }
            res.status(200).json({ success: true, data: updatedReview });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async deleteReview(req, res) {
        try {
            const reviewId = req.params.id;
            await review_service_1.reviewService.deleteReview(reviewId);
            res
                .status(200)
                .json({ success: true, message: "Review deleted successfully" });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
};
