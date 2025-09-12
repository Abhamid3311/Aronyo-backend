import { Order } from "../orders/order.model";
import { IReview } from "./review.interface";
import { Review } from "./review.model";

class ReviewService {
  async createOrUpdateReview(
    userId: string,
    orderId: string,
    rating: number,
    comment: string
  ): Promise<IReview> {
    // Directly create a new review
    const review = await new Review({
      userId,
      orderId,
      rating,
      comment,
      isActive: true,
    }).save();

    // --- Update Order to mark as reviewed ---
    const order = await Order.findById(orderId);
    if (order) {
      order.isReviewed = true; // add new property if not exists or update
      await order.save();
    }

    return review;
  }

  async getAllActiveReviews() {
    return Review.find({ isActive: true })
      .populate("userId", "name email image")
      .sort({ createdAt: -1 });
  }

  async getAllReviews() {
    return Review.find().populate("userId", "name email image");
  }

  async deleteReview(reviewId: string) {
    // Find the review first
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    const orderId = review.orderId;

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    // Update the order to mark it as not reviewed
    const order = await Order.findById(orderId);
    if (order) {
      order.isReviewed = false; // mark as not reviewed
      await order.save();
    }

    return { success: true, message: "Review deleted and order updated" };
  }

  async updateReviewStatus(reviewId: string, isActive: boolean) {
    return Review.findByIdAndUpdate(
      reviewId,
      { isActive },
      { new: true, runValidators: true }
    );
  }
}

export const reviewService = new ReviewService();
