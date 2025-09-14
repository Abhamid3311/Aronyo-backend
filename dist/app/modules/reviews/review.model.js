"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Order",
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: [true, "Comment is required"],
        maxlength: 500,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
