"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"],
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product reference is required"],
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"],
    },
    comment: {
        type: String,
        maxlength: [500, "Comment cannot exceed 500 characters"],
        trim: true,
    },
}, { timestamps: true });
// Enforce one review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
