"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_service_1 = require("./order.service");
const sendErrorResponse_1 = require("../../../utils/sendErrorResponse");
const cart_service_1 = require("../cart/cart.service");
const uuid_1 = require("uuid");
const product_model_1 = require("../products/product.model");
const handelPayment_1 = require("./handelPayment");
const user_model_1 = require("../user/user.model");
exports.orderController = {
    async createOrder(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new Error("User not authenticated");
            const { shippingAddress, paymentMethod, deliveryCharge = 0 } = req.body;
            if (!shippingAddress || !paymentMethod) {
                throw new Error("Shipping address and payment method required");
            }
            // Validate payment method
            if (!["cod", "online"].includes(paymentMethod)) {
                throw new Error("Invalid payment method. Use 'cod' or 'online'");
            }
            // Get cart
            const cart = await cart_service_1.CartService.getCart(userId);
            if (!cart || !cart.items.length) {
                throw new Error("Cart is empty");
            }
            //Build order items
            const orderItems = await Promise.all(cart.items.map(async (item) => {
                const product = await product_model_1.Product.findById(item.productId);
                if (!product)
                    throw new Error(`Product not found`);
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.title}`);
                }
                return {
                    product: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                };
            }));
            // Totals
            const totalAmount = orderItems.reduce((sum, i) => sum + i.quantity * i.price, 0);
            const totalPayable = totalAmount + deliveryCharge;
            // Transaction ID
            const transactionId = "TXN-" + Date.now() + "-" + (0, uuid_1.v4)().slice(0, 8);
            // Create order data
            const orderData = {
                user: userId,
                orderItems,
                shippingAddress,
                paymentMethod,
                paymentStatus: "pending",
                orderStatus: "pending",
                totalAmount,
                deliveryCharge,
                totalPayable,
                transactionId,
            };
            //  Save order via Service
            const order = await order_service_1.OrderService.createOrder(orderData);
            //  Clear cart
            await cart_service_1.CartService.clearCart(userId);
            // Handle payment method
            if (paymentMethod === "online") {
                // Get user details for SSL Commerce
                const user = await user_model_1.User.findById(userId); // Assuming you have User model
                if (!user) {
                    // Rollback: delete order if user not found
                    await order_service_1.OrderService.cancelOrder(String(order._id));
                    throw new Error("User not found");
                }
                // Initiate SSL Commerce payment
                const paymentUrl = await (0, handelPayment_1.initiateSSLCommerzPayment)(order, user);
                if (paymentUrl) {
                    res.status(200).json({
                        success: true,
                        message: "Redirect to SSLCommerz for payment",
                        paymentUrl,
                        orderId: order._id,
                    });
                    return;
                }
                else {
                    // Payment initiation failed - rollback
                    await order_service_1.OrderService.cancelOrder(String(order._id));
                    throw new Error("Failed to initiate online payment");
                }
            }
            // For COD payment
            res.status(201).json({
                success: true,
                message: "Order created successfully with Cash on Delivery",
                data: order,
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getAllOrders(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
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
            const orderId = req.params.orderId;
            const order = await order_service_1.OrderService.getSingleOrder(orderId);
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
