"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderItemSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
});
const shippingAddressSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    area: { type: String, trim: true },
    address: { type: String, required: true, trim: true },
    deliveryNotes: { type: String, trim: true },
});
const orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    // 🔥 both allowed, only saved, no gateway flow yet
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    orderStatus: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    totalAmount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    totalPayable: { type: Number, required: true },
    transactionId: { type: String, unique: true },
    isReviewed: { type: Boolean, default: false },
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)("Order", orderSchema);
