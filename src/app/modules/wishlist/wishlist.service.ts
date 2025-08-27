import { Wishlist } from "./wishlist.model";
import { Types } from "mongoose";

const addToWishlist = async (userId: string, productId: string) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: new Types.ObjectId(userId),
      products: [new Types.ObjectId(productId)],
    });
  } else {
    if (!wishlist.products.includes(new Types.ObjectId(productId))) {
      wishlist.products.push(new Types.ObjectId(productId));
      await wishlist.save();
    }
  }

  return wishlist.populate("products");
};

const removeFromWishlist = async (userId: string, productId: string) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $pull: { products: new Types.ObjectId(productId) } },
    { new: true }
  ).populate("products");

  return wishlist;
};

const getWishlist = async (userId: string) => {
  return Wishlist.findOne({ user: userId }).populate("products");
};

export const WishlistService = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
