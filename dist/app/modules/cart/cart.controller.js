"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = void 0;
const cart_service_1 = require("./cart.service");
const sendErrorResponse_1 = require("../../../utils/sendErrorResponse");
exports.cartController = {
    async addToCart(req, res) {
        try {
            const userId = req.user?.userId;
            const { productId, quantity = 1 } = req.body;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            if (!productId) {
                throw new Error("Product ID is required");
            }
            const cart = await cart_service_1.CartService.addToCart(userId, productId, quantity);
            res.status(200).json({
                success: true,
                data: cart,
                message: "Product added to cart successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getCart(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const cart = await cart_service_1.CartService.getCart(userId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            res.status(200).json({
                success: true,
                data: cart,
                message: "Cart retrieved successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async updateQuantity(req, res) {
        try {
            const userId = req.user?.userId;
            const { productId, quantity } = req.body;
            if (!userId)
                throw new Error("User not authenticated");
            if (!productId)
                throw new Error("Product ID is required");
            if (quantity === undefined)
                throw new Error("Quantity is required");
            const cart = await cart_service_1.CartService.updateQuantity(userId, productId, quantity);
            if (!cart)
                throw new Error("Cart or product not found");
            res.status(200).json({
                success: true,
                data: cart,
                message: "Cart updated successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async removeItem(req, res) {
        try {
            const userId = req.user?.userId;
            const { productId } = req.body;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            if (!productId) {
                throw new Error("Product ID is required");
            }
            const cart = await cart_service_1.CartService.removeItem(userId, productId);
            if (!cart) {
                throw new Error("Cart or product not found");
            }
            res.status(200).json({
                success: true,
                data: cart,
                message: "Item removed from cart successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async clearCart(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const cart = await cart_service_1.CartService.clearCart(userId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            res.status(200).json({
                success: true,
                message: "Cart cleared successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
};
