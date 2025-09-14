"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const order_model_1 = require("../orders/order.model");
const review_model_1 = require("./review.model");
class ReviewService {
    async createOrUpdateReview(userId, orderId, rating, comment) {
        // Directly create a new review
        const review = await new review_model_1.Review({
            userId,
            orderId,
            rating,
            comment,
            isActive: true,
        }).save();
        // --- Update Order to mark as reviewed ---
        const order = await order_model_1.Order.findById(orderId);
        if (order) {
            order.isReviewed = true; // add new property if not exists or update
            await order.save();
        }
        return review;
    }
    async getAllActiveReviews() {
        return review_model_1.Review.find({ isActive: true })
            .populate("userId", "name email image")
            .sort({ createdAt: -1 });
    }
    async getAllReviews() {
        return review_model_1.Review.find().populate("userId", "name email image");
    }
    async deleteReview(reviewId) {
        // Find the review first
        const review = await review_model_1.Review.findById(reviewId);
        if (!review) {
            throw new Error("Review not found");
        }
        const orderId = review.orderId;
        // Delete the review
        await review_model_1.Review.findByIdAndDelete(reviewId);
        // Update the order to mark it as not reviewed
        const order = await order_model_1.Order.findById(orderId);
        if (order) {
            order.isReviewed = false; // mark as not reviewed
            await order.save();
        }
        return { success: true, message: "Review deleted and order updated" };
    }
    async updateReviewStatus(reviewId, isActive) {
        return review_model_1.Review.findByIdAndUpdate(reviewId, { isActive }, { new: true, runValidators: true });
    }
}
exports.reviewService = new ReviewService();
