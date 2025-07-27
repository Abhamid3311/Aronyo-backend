import { Cart } from "./cart.model";
import { ICart } from "./cart.interface";
import { Types } from "mongoose";

export const CartService = {
  async addToCart(userId: string, productId: string): Promise<ICart> {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      // Try to find the product in existing items
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          productId: new Types.ObjectId(productId),
          quantity: 1,
        });
      }

      return await cart.save();
    } else {
      // If no cart exists, create one
      return await Cart.create({
        userId,
        items: [{ productId: new Types.ObjectId(productId), quantity: 1 }],
      });
    }
  },
  async getCart(userId: string): Promise<ICart | null> {
    return await Cart.findOne({ userId }).populate("items.productId");
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
