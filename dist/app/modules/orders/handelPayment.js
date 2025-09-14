"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentIPN = exports.paymentCancel = exports.paymentFail = exports.paymentSuccess = exports.initiateSSLCommerzPayment = void 0;
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const order_model_1 = require("./order.model");
const order_service_1 = require("./order.service");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;
const is_live = false;
// Function to initiate SSLCOMMERZ payment
// Updated function to work with your new order structure
const initiateSSLCommerzPayment = async (order, user) => {
    try {
        const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
        const data = {
            total_amount: parseFloat(order.totalPayable.toFixed(2)),
            currency: "BDT",
            tran_id: order.transactionId,
            success_url: `${BACKEND_BASE_URL}/orders/payment/success/${order.transactionId}`,
            fail_url: `${BACKEND_BASE_URL}/orders/payment/fail/${order.transactionId}`,
            cancel_url: `${BACKEND_BASE_URL}/orders/payment/cancel/${order.transactionId}`,
            ipn_url: `${BACKEND_BASE_URL}/orders/payment/ipn`,
            shipping_method: "Courier",
            product_name: "Plant Order",
            product_category: "Plant",
            product_profile: "general",
            cus_name: user.name || "Customer",
            cus_email: user.email || "customer@example.com",
            cus_add1: order.shippingAddress.address,
            cus_city: order.shippingAddress.city,
            cus_state: order.shippingAddress.area,
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: order.shippingAddress.phone,
            ship_name: order.shippingAddress.name || "Customer",
            ship_add1: order.shippingAddress.address,
            ship_city: "Dhaka",
            ship_state: "Dhaka",
            ship_postcode: 1000,
            ship_country: "Bangladesh",
        };
        const apiResponse = await sslcz.init(data);
        return apiResponse.GatewayPageURL || null;
    }
    catch (error) {
        console.error("❌ SSLCommerz payment initiation failed:", error);
        return null;
    }
};
exports.initiateSSLCommerzPayment = initiateSSLCommerzPayment;
// Payment Success Handler
const paymentSuccess = async (req, res) => {
    try {
        console.log("Payment success request:", {
            method: req.method,
            params: req.params,
            body: req.body,
            query: req.query,
        });
        const { tran_id } = req.params;
        const order = await order_model_1.Order.findOne({ transactionId: tran_id });
        if (!order || order.paymentStatus === "paid") {
            return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
        }
        const val_id = req.body.val_id || req.query.val_id;
        if (!val_id) {
            console.error("❌ Missing val_id in success callback", req.body, req.query);
            await order_service_1.OrderService.updateOrderStatus(String(order._id), {
                paymentStatus: "failed",
                orderStatus: "cancelled",
            });
            return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
        }
        const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
        const validationResponse = await sslcz.validate({ val_id });
        if (validationResponse.status === "VALID" ||
            validationResponse.status === "VALIDATED") {
            await order_service_1.OrderService.updateOrderStatus(String(order._id), {
                paymentStatus: "paid",
                orderStatus: "confirmed", // ✅ better than leaving it pending
            });
            return res.redirect(`${CLIENT_BASE_URL}/payment/success`);
        }
        else {
            await order_service_1.OrderService.updateOrderStatus(String(order._id), {
                paymentStatus: "failed",
                orderStatus: "cancelled",
            });
            return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
        }
    }
    catch (error) {
        console.error("❌ Payment success handling failed:", error);
        if (req.params.tran_id) {
            const order = await order_model_1.Order.findOne({ transactionId: req.params.tran_id });
            if (order) {
                await order_service_1.OrderService.updateOrderStatus(String(order._id), {
                    paymentStatus: "failed",
                    orderStatus: "cancelled",
                });
            }
        }
        return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
    }
};
exports.paymentSuccess = paymentSuccess;
// Payment Fail Handler
const paymentFail = async (req, res) => {
    try {
        console.log("Payment fail request:", req.params); // Debug log
        const { tran_id } = req.params;
        const order = await order_model_1.Order.findOne({ transactionId: tran_id });
        if (order) {
            await order_service_1.OrderService.cancelOrder(String(order._id));
        }
        return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
    }
    catch (error) {
        console.error("❌ Payment fail handling failed:", error);
        return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
    }
};
exports.paymentFail = paymentFail;
// Payment Cancel Handler
const paymentCancel = async (req, res) => {
    try {
        console.log("Payment cancel request:", req.params); // Debug log
        const { tran_id } = req.params;
        const order = await order_model_1.Order.findOne({ transactionId: tran_id });
        if (order) {
            await order_service_1.OrderService.cancelOrder(String(order._id));
        }
        return res.redirect(`${CLIENT_BASE_URL}/payment/cancel`);
    }
    catch (error) {
        console.error("❌ Payment cancel handling failed:", error);
        return res.redirect(`${CLIENT_BASE_URL}/payment/cancel`);
    }
};
exports.paymentCancel = paymentCancel;
// IPN Handler
const paymentIPN = async (req, res) => {
    try {
        const { tran_id, status, val_id } = req.body;
        const order = await order_model_1.Order.findOne({ transactionId: tran_id });
        if (!order) {
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        }
        if (status === "VALID" || status === "VALIDATED") {
            const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
            const validationResponse = await sslcz.validate({ val_id });
            if (validationResponse.status === "VALID" ||
                validationResponse.status === "VALIDATED") {
                await order_service_1.OrderService.updateOrderStatus(String(order._id), {
                    paymentStatus: "paid",
                    // status: "confirmed",
                });
            }
            else {
                await order_service_1.OrderService.cancelOrder(String(order._id));
            }
        }
        else {
            await order_service_1.OrderService.cancelOrder(String(order._id));
        }
        return res.status(200).json({ success: true, message: "IPN processed" });
    }
    catch (error) {
        console.error("❌ IPN handling failed:", error);
        return res
            .status(500)
            .json({ success: false, message: "IPN processing failed" });
    }
};
exports.paymentIPN = paymentIPN;
