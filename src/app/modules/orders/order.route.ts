import { Router } from "express";
import { orderController } from "./order.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.post(
  "/",
  authMiddleware(["user", "admin", "staff"]),
  orderController.createOrder
);

router.get(
  "/",
  authMiddleware(["user", "admin", "staff"]),
  orderController.getAllOrders
);
router.get(
  "/all",
  authMiddleware(["admin", "staff"]),
  orderController.getAllOrdersAdmin
);

router.get(
  "/:orderId",
  authMiddleware(["user", "admin", "staff"]),
  orderController.getSingleOrder
);

router.patch(
  "/:orderId/status",
  authMiddleware(["admin", "staff"]),
  orderController.updateOrderStatus
);

router.delete(
  "/:orderId",
  authMiddleware(["admin", "staff"]),
  orderController.cancelOrder
);

export const orderRoutes = router;
