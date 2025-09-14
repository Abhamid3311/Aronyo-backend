"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const order_model_1 = require("./order.model");
exports.OrderService = {
    async createOrder(orderData) {
        const order = await order_model_1.Order.create(orderData);
        return order;
    },
    async getAllOrders(userId) {
        return await order_model_1.Order.find({
            user: userId,
            orderStatus: { $ne: "cancelled" }, // 🚫 exclude cancelled
        })
            .populate("orderItems.product")
            .populate("user", "name email")
            .sort({ createdAt: -1 }); // ✅ newest first
    },
    async getAllOrdersAdmin(skip, limit) {
        const [orders, total] = await Promise.all([
            order_model_1.Order.find()
                .populate("orderItems.product")
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            order_model_1.Order.countDocuments(),
        ]);
        return { orders, total };
    },
    async getSingleOrder(orderId) {
        return await order_model_1.Order.findById(orderId)
            .populate("orderItems.product")
            .populate("user", "name email");
    },
    async updateOrderStatus(orderId, statusData) {
        const order = await order_model_1.Order.findById(orderId);
        if (!order)
            return null;
        if (order.paymentMethod === "cod" &&
            statusData.orderStatus === "delivered") {
            statusData.paymentStatus = "paid";
        }
        const updatedOrder = await order_model_1.Order.findOneAndUpdate({ _id: orderId }, statusData, { new: true, runValidators: true }).populate("orderItems.product");
        return updatedOrder;
    },
    async cancelOrder(orderId) {
        const order = await order_model_1.Order.findOne({ _id: orderId });
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.orderStatus !== "pending") {
            throw new Error("Only pending orders can be cancelled");
        }
        return await order_model_1.Order.findOneAndUpdate({ _id: orderId }, { orderStatus: "cancelled" }, { new: true, runValidators: true }).populate("orderItems.product");
    },
};
