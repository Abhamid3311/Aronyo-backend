"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const wishlist_model_1 = require("./wishlist.model");
const mongoose_1 = require("mongoose");
const addToWishlist = async (userId, productId) => {
    let wishlist = await wishlist_model_1.Wishlist.findOne({ user: userId });
    if (!wishlist) {
        wishlist = await wishlist_model_1.Wishlist.create({
            user: new mongoose_1.Types.ObjectId(userId),
            products: [new mongoose_1.Types.ObjectId(productId)],
        });
    }
    else {
        if (!wishlist.products.includes(new mongoose_1.Types.ObjectId(productId))) {
            wishlist.products.push(new mongoose_1.Types.ObjectId(productId));
            await wishlist.save();
        }
    }
    return wishlist.populate("products");
};
const removeFromWishlist = async (userId, productId) => {
    const wishlist = await wishlist_model_1.Wishlist.findOneAndUpdate({ user: userId }, { $pull: { products: new mongoose_1.Types.ObjectId(productId) } }, { new: true }).populate("products");
    return wishlist;
};
const getWishlist = async (userId) => {
    return wishlist_model_1.Wishlist.findOne({ user: userId }).populate("products");
};
exports.WishlistService = {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
};
