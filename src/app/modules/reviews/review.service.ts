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

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment ?? "";
      return await existingReview.save();
    }

    const review = new Review({
      userId,
      orderId,
      rating,
      comment,
      isActive: true,
    });
    return await review.save();
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
    return Review.find()
      .populate("userId", "name email")
      .populate("orderId", "_id status createdAt");
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
