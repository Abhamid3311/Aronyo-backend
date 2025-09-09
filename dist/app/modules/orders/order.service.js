"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const order_model_1 = require("./order.model");
const product_model_1 = require("../products/product.model");
const uuid_1 = require("uuid");
const cart_service_1 = require("../cart/cart.service");
exports.OrderService = {
    async createOrder(userId, orderData) {
        // 1️⃣ Get cart
        const cart = await cart_service_1.CartService.getCart(userId);
        if (!cart || !cart.items.length) {
            throw new Error("Cart is empty");
        }
        // 2️⃣ Build order items
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
        // 3️⃣ Totals
        const totalAmount = orderItems.reduce((sum, i) => sum + i.quantity * i.price, 0);
        const deliveryCharge = orderData.deliveryCharge || 0;
        const totalPayable = totalAmount + deliveryCharge;
        // 4️⃣ Transaction ID
        const transactionId = "TXN-" + Date.now() + "-" + (0, uuid_1.v4)().slice(0, 8);
        // 5️⃣ Save order
        const order = await order_model_1.Order.create({
            user: userId,
            orderItems,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod, // 🔥 either cod or online
            paymentStatus: "pending",
            orderStatus: "pending",
            totalAmount,
            deliveryCharge,
            totalPayable,
            transactionId,
        });
        // 6️⃣ Clear cart
        await cart_service_1.CartService.clearCart(userId);
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
    async getSingleOrder(orderId, userId) {
        return await order_model_1.Order.findOne({ _id: orderId, user: userId })
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
