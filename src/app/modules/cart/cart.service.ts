import { Cart } from "./cart.model";
import { ICart } from "./cart.interface";
import { Types } from "mongoose";

export const CartService = {
  async addToCart(
    userId: string,
    productId: string,
    quantity: number = 1
  ): Promise<ICart> {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId: new Types.ObjectId(productId),
          quantity,
        });
      }

      return await cart.save();
    } else {
      return await Cart.create({
        userId,
        items: [{ productId: new Types.ObjectId(productId), quantity }],
      });
    }
  },

  async getCart(userId: string): Promise<ICart | null> {
    // Populate productId to get full product details
    return await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "_id title price discountPrice images stock", // pick only what you need
    });
  },

  async decreaseQuantity(
    userId: string,
    productId: string
  ): Promise<ICart | null> {
    const cart = await Cart.findOne({ userId });

    if (!cart) return null;

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) return null;

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      // If quantity is 1, remove the item from the cart
      cart.items.splice(itemIndex, 1);
    }

    return await cart.save();
  },

  async removeItem(userId: string, productId: string): Promise<ICart | null> {
    return await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate("items.productId");
  },

  async clearCart(userId: string): Promise<ICart | null> {
    return await Cart.findOneAndDelete({ userId });
  },
};
