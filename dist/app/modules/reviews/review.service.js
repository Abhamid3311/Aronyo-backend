"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const review_model_1 = require("./review.model");
class ReviewService {
    async createOrUpdateReview(userId, productId, rating, comment) {
        // Try to find existing review
        const existingReview = await review_model_1.Review.findOne({ userId, productId });
        if (existingReview) {
            existingReview.rating = rating;
            existingReview.comment = comment;
            return await existingReview.save();
        }
        // Create new review
        const review = new review_model_1.Review({ userId, productId, rating, comment });
        return await review.save();
    }
    async getReviewsByProduct(productId) {
        return review_model_1.Review.find({ productId }).populate("userId", "name email"); // populate user name/email for showing
    }
    async getAllReviews() {
        return review_model_1.Review.find()
            .populate("userId", "name email")
            .populate("productId", "title slug");
    }
    async updateReview(reviewId, updateData) {
        return review_model_1.Review.findByIdAndUpdate(reviewId, updateData, {
            new: true,
            runValidators: true,
        });
    }
    async deleteReview(reviewId) {
        return review_model_1.Review.findByIdAndDelete(reviewId);
    }
}
exports.reviewService = new ReviewService();
