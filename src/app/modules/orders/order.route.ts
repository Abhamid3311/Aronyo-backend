import { Router } from "express";
import { orderController } from "./order.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  paymentCancel,
  paymentFail,
  paymentIPN,
  paymentSuccess,
} from "./handelPayment";

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

// SSL Commerce callback routes
router.post("/payment/success/:tran_id", paymentSuccess);
router.post("/payment/fail/:tran_id", paymentFail);
router.post("/payment/cancel/:tran_id", paymentCancel);
router.post("/payment/ipn", paymentIPN);

// Alternative routes if SSL sends GET requests
router.get("/payment/success/:tran_id", paymentSuccess);
router.get("/payment/fail/:tran_id", paymentFail);
router.get("/payment/cancel/:tran_id", paymentCancel);

export const orderRoutes = router;
