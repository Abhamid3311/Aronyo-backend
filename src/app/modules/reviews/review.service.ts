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
    const existingReview = await Review.findOne({ userId, orderId });

    let review: IReview;

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment ?? "";
      review = await existingReview.save();
    } else {
      review = await new Review({
        userId,
        orderId,
        rating,
        comment,
        isActive: true,
      }).save();
    }

    // --- Update Order to mark as reviewed ---
    const order = await Order.findById(orderId);
    if (order) {
      order.isReviewed = true; // add new property if not exists or update
      await order.save();
    }

    return review;
  }

  async getSingleReview(reviewId: string) {
    return Review.findById(reviewId)
      .populate("userId", "name email")
      .populate("orderId", "_id status createdAt");
  }

  /* async getAllActiveReviews(limit = 5) {
    return Review.find({ isActive: true })
      .populate("userId", "name")
      .populate("orderId", "_id status createdAt")
      .sort({ createdAt: -1 })
      .limit(limit);
  } */

  async getAllActiveReviews() {
    return Review.find({ isActive: true })
      .populate("userId", "name")
      .populate("orderId", "_id status createdAt")
      .sort({ createdAt: -1 });
  }

  async getAllReviews() {
    return Review.find().populate("userId", "name email");
  }

  async updateReview(reviewId: string, updateData: Partial<IReview>) {
    return Review.findByIdAndUpdate(reviewId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteReview(reviewId: string) {
    return Review.findByIdAndDelete(reviewId);
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
