import { Router } from "express";
import { orderController } from "./order.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.post(
  "/create-order",
  authMiddleware(["user", "admin", "staff"]),
  orderController.createOrder
);

router.get(
  "/my-orders",
  authMiddleware(["user", "admin", "staff"]),
  orderController.getAllOrders
);

router.get(
  "/admin/all-orders",
  authMiddleware(["admin", "staff"]),
  orderController.getAllOrdersAdmin
);

router.get(
  "/:orderId",
  authMiddleware(["user", "admin", "staff"]),
  orderController.getSingleOrder
);

router.patch(
  "/update-order/:orderId",
  authMiddleware(["admin", "staff"]),
  orderController.updateOrderStatus
);

router.delete(
  "/delete-order/:orderId",
  authMiddleware(["user", "admin", "staff"]),
  orderController.cancelOrder
);

export const orderRoutes = router;
