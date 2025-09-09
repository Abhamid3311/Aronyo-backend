"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const cart_model_1 = require("./cart.model");
const mongoose_1 = require("mongoose");
exports.CartService = {
    async addToCart(userId, productId, quantity = 1) {
        const cart = await cart_model_1.Cart.findOne({ userId });
        if (cart) {
            const existingItem = cart.items.find((item) => item.productId.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            }
            else {
                cart.items.push({
                    productId: new mongoose_1.Types.ObjectId(productId),
                    quantity,
                });
            }
            return await cart.save();
        }
        else {
            return await cart_model_1.Cart.create({
                userId,
                items: [{ productId: new mongoose_1.Types.ObjectId(productId), quantity }],
            });
        }
    },
    async getCart(userId) {
        // Populate productId to get full product details
        return await cart_model_1.Cart.findOne({ userId }).populate({
            path: "items.productId",
            select: "_id title price discountPrice images stock", // pick only what you need
        });
    },
    async updateQuantity(userId, productId, quantity) {
        const cart = await cart_model_1.Cart.findOne({ userId });
        if (!cart)
            return null;
        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
        if (itemIndex === -1)
            return null;
        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1); // remove
        }
        else {
            cart.items[itemIndex].quantity = quantity;
        }
        return await cart.save();
    },
    async removeItem(userId, productId) {
        return await cart_model_1.Cart.findOneAndUpdate({ userId }, { $pull: { items: { productId } } }, { new: true }).populate("items.productId");
    },
    async clearCart(userId) {
        return await cart_model_1.Cart.findOneAndDelete({ userId });
    },
};
