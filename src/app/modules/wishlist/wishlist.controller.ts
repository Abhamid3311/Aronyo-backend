import { Request, Response } from "express";
import { WishlistService } from "./wishlist.service";

const addToWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!userId) {
      throw new Error("User not authenticated");
    }
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const wishlist = await WishlistService.addToWishlist(userId, productId);
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!userId) {
      throw new Error("User not authenticated");
    }
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const wishlist = await WishlistService.removeFromWishlist(
      userId,
      productId
    );
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const wishlist = await WishlistService.getWishlist(userId);
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const WishlistController = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
