import { Cart } from "./cart.model";
import { ICart } from "./cart.interface";

export const CartService = {
  async addToCart(userId: string, productId: string): Promise<ICart> {
    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      return await existingCartItem.save();
    } else {
      return await Cart.create({
        userId,
        productId,
        quantity: 1,
      });
    }
  },

  async getCart(userId: string): Promise<ICart | null> {
    return await Cart.findOne({ userId }).populate("productId");
  },

  async decreaseQuantity(
    userId: string,
    productId: string
  ): Promise<ICart | null> {
    const cartItem = await Cart.findOne({ userId, productId });

    if (!cartItem) return null;

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      return await cartItem.save();
    } else {
      // Quantity is 1, so remove the cart item
      await Cart.findOneAndDelete({ userId, productId });
      return null;
    }
  },

  async removeItem(userId: string, productId: string): Promise<ICart | null> {
    return await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate("productId");
  },

  async clearCart(userId: string): Promise<ICart | null> {
    return await Cart.findOneAndDelete({ userId });
  },
};
