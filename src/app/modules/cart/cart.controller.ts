import { Request, Response } from "express";
import { CartService } from "./cart.service";
import { sendErrorResponse } from "../../../utils/sendErrorResponse";

export const cartController = {
  async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { productId } = req.body;

      if (!userId) {
        throw new Error("User not authenticated");
      }
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const cart = await CartService.addToCart(userId, productId);
      res.status(200).json({
        success: true,
        data: cart,
        message: "Product added to cart successfully",
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const cart = await CartService.getCart(userId);

      if (!cart) {
        throw new Error("Cart not found");
      }
      res.status(200).json({
        success: true,
        data: cart,
        message: "Cart retrieved successfully",
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async decreaseQuantity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { productId } = req.body;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      if (!productId) {
        throw new Error("Product ID is required");
      }
      const cart = await CartService.decreaseQuantity(userId, productId);
      if (!cart) {
        throw new Error("Cart or product not found");
      }
      res.status(200).json({
        success: true,
        data: cart,
        message: "Quantity decreased successfully",
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async removeItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { productId } = req.body;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      if (!productId) {
        throw new Error("Product ID is required");
      }
      const cart = await CartService.removeItem(userId, productId);
      if (!cart) {
        throw new Error("Cart or product not found");
      }
      res.status(200).json({
        success: true,
        data: cart,
        message: "Item removed from cart successfully",
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const cart = await CartService.clearCart(userId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};
