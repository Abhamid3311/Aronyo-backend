"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.post("/create-order", (0, auth_middleware_1.authMiddleware)(["user", "admin", "staff"]), order_controller_1.orderController.createOrder);
router.get("/my-orders", (0, auth_middleware_1.authMiddleware)(["user", "admin", "staff"]), order_controller_1.orderController.getAllOrders);
router.get("/admin/all-orders", (0, auth_middleware_1.authMiddleware)(["admin", "staff"]), order_controller_1.orderController.getAllOrdersAdmin);
router.get("/:orderId", (0, auth_middleware_1.authMiddleware)(["user", "admin", "staff"]), order_controller_1.orderController.getSingleOrder);
router.patch("/update-order/:orderId", (0, auth_middleware_1.authMiddleware)(["admin", "staff"]), order_controller_1.orderController.updateOrderStatus);
router.delete("/delete-order/:orderId", (0, auth_middleware_1.authMiddleware)(["user", "admin", "staff"]), order_controller_1.orderController.cancelOrder);
exports.orderRoutes = router;
