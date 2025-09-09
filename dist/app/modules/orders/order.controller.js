"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_service_1 = require("./order.service");
const sendErrorResponse_1 = require("../../../utils/sendErrorResponse");
exports.orderController = {
    async createOrder(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                throw new Error("User not authenticated");
            const orderData = req.body;
            if (!orderData.shippingAddress || !orderData.paymentMethod) {
                throw new Error("Shipping address and payment method required");
            }
            const order = await order_service_1.OrderService.createOrder(userId, orderData);
            res.status(201).json({
                success: true,
                message: "Order created successfully",
                data: order,
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getAllOrders(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const orders = await order_service_1.OrderService.getAllOrders(userId);
            res.status(200).json({
                success: true,
                data: orders,
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getAllOrdersAdmin(req, res) {
        try {
            const queryParams = req.query;
            const page = parseInt(queryParams.page || "1");
            const limit = parseInt(queryParams.limit || "10");
            const skip = (page - 1) * limit;
            const { orders, total } = await order_service_1.OrderService.getAllOrdersAdmin(skip, limit);
            res.status(200).json({
                success: true,
                data: orders,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getSingleOrder(req, res) {
        try {
            const userId = req.user?.userId;
            const orderId = req.params.orderId;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const order = await order_service_1.OrderService.getSingleOrder(orderId, userId);
            if (!order) {
                throw new Error("Order not found");
            }
            res.status(200).json({
                success: true,
                data: order,
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async updateOrderStatus(req, res) {
        try {
            const orderId = req.params.orderId;
            const statusData = req.body;
            if (!statusData.orderStatus && !statusData.paymentStatus) {
                throw new Error("Order status or payment status is required");
            }
            const updatedOrder = await order_service_1.OrderService.updateOrderStatus(orderId, statusData);
            if (!updatedOrder) {
                throw new Error("Order not found");
            }
            res.status(200).json({
                success: true,
                message: "Order status updated successfully",
                data: updatedOrder,
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async cancelOrder(req, res) {
        try {
            const orderId = req.params.orderId;
            const order = await order_service_1.OrderService.cancelOrder(orderId);
            if (!order) {
                throw new Error("Order not found");
            }
            res.status(200).json({
                success: true,
                message: "Order cancelled successfully",
                data: order,
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
};
