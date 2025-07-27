import { Request, Response } from "express";
import { reviewService } from "./review.service";
import { sendErrorResponse } from "../../../utils/sendErrorResponse";

export const reviewController = {
  async createReview(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId, rating, comment } = req.body;

      const review = await reviewService.createOrUpdateReview(
        userId,
        productId,
        rating,
        comment
      );
      res.status(201).json({
        success: true,
        data: review,
        message: "Review saved successfully",
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getProductReviews(req: Request, res: Response) {
    try {
      const productId = req.params.productId;
      const reviews = await reviewService.getReviewsByProduct(productId);
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getAllReviews(req: Request, res: Response) {
    try {
      const reviews = await reviewService.getAllReviews();
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const reviewId = req.params.id;
      const updateData = req.body;
      const updatedReview = await reviewService.updateReview(
        reviewId,
        updateData
      );

      if (!updatedReview) {
        res.status(404).json({ success: false, message: "Review not found" });
      }
      res.status(200).json({ success: true, data: updatedReview });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async deleteReview(req: Request, res: Response) {
    try {
      const reviewId = req.params.id;
      await reviewService.deleteReview(reviewId);
      res
        .status(200)
        .json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};
