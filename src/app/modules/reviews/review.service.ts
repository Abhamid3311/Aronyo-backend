import { IReview } from "./review.interface";
import { Review } from "./review.model";

class ReviewService {

  async createOrUpdateReview(
    userId: string,
    productId: string,
    rating: number,
    comment?: string
  ): Promise<IReview> {
    // Try to find existing review
    const existingReview = await Review.findOne({ userId, productId });
    
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      return await existingReview.save();
    }

    // Create new review
    const review = new Review({ userId, productId, rating, comment });
    return await review.save();
  }

  async getReviewsByProduct(productId: string) {
    return Review.find({ productId }).populate("userId", "name email"); // populate user name/email for showing
  }

  async getAllReviews() {
    return Review.find()
      .populate("userId", "name email")
      .populate("productId", "title slug");
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
}

export const reviewService = new ReviewService();
