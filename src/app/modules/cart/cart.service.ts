import { Cart } from "./cart.model";
import { Types } from "mongoose";
import { ICart } from "./cart.interface";

export const CartService = {
  async getCart(userId: string): Promise<ICart | null> {
    return await Cart.findOne({ userId }).populate("items.productId");
  },

  async addToCart(userId: string, productId: string): Promise<ICart> {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      const item = cart.items.find((i) => i.productId.toString() === productId);
      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({
          productId: new Types.ObjectId(productId),
          quantity: 1,
        });
      }
      return await cart.save();
    } else {
      return await Cart.create({
        userId,
        items: [{ productId: new Types.ObjectId(productId), quantity: 1 }],
      });
    }
  },

  async increaseQuantity(
    userId: string,
    productId: string
  ): Promise<ICart | null> {
    return await Cart.findOneAndUpdate(
      { userId, "items.productId": productId },
      { $inc: { "items.$.quantity": 1 } },
      { new: true }
    ).populate("items.productId");
  },

  async decreaseQuantity(
    userId: string,
    productId: string
  ): Promise<ICart | null> {
    const cart = await Cart.findOne({ userId });
    if (!cart) return null;

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return null;

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId
      );
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
