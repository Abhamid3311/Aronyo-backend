"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistController = void 0;
const wishlist_service_1 = require("./wishlist.service");
const addToWishlist = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { productId } = req.body;
        if (!userId) {
            throw new Error("User not authenticated");
        }
        if (!productId) {
            throw new Error("Product ID is required");
        }
        const wishlist = await wishlist_service_1.WishlistService.addToWishlist(userId, productId);
        res.status(200).json({ success: true, data: wishlist });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const removeFromWishlist = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { productId } = req.body;
        if (!userId) {
            throw new Error("User not authenticated");
        }
        if (!productId) {
            throw new Error("Product ID is required");
        }
        const wishlist = await wishlist_service_1.WishlistService.removeFromWishlist(userId, productId);
        res.status(200).json({ success: true, data: wishlist });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const getWishlist = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const wishlist = await wishlist_service_1.WishlistService.getWishlist(userId);
        res.status(200).json({ success: true, data: wishlist });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.WishlistController = {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
};
