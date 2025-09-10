/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOrder } from "./order.interface";
import SSLCommerzPayment from "sslcommerz-lts";
import { Order } from "./order.model";
import { Request, Response } from "express";
import { OrderService } from "./order.service";

export interface PaymentParams {
  tran_id: string;
}
export interface PaymentQuery {
  userId?: string;
  val_id: string;
}
export interface PaymentBody {
  amount?: number;
  val_id: string;
}

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;
const is_live = false;

// Function to initiate SSLCOMMERZ payment
// Updated function to work with your new order structure
export const initiateSSLCommerzPayment = async (
  order: IOrder,
  user: any
): Promise<string | null> => {
  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

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
  } catch (error) {
    console.error("❌ SSLCommerz payment initiation failed:", error);
    return null;
  }
};

// Payment Success Handler
export const paymentSuccess = async (
  req: Request<PaymentParams, any, PaymentBody, PaymentQuery>,
  res: Response
) => {
  try {
    console.log("Payment success request:", {
      method: req.method,
      params: req.params,
      body: req.body,
      query: req.query,
    });

    const { tran_id } = req.params;
    const order = await Order.findOne({ transactionId: tran_id });

    if (!order || order.paymentStatus === "paid") {
      return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
    }

    const val_id = req.body.val_id || req.query.val_id;
    if (!val_id) {
      console.error(
        "❌ Missing val_id in success callback",
        req.body,
        req.query
      );
      await OrderService.updateOrderStatus(String(order._id), {
        paymentStatus: "failed",
        orderStatus: "cancelled",
      });
      return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
    }

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validationResponse = await sslcz.validate({ val_id });

    if (
      validationResponse.status === "VALID" ||
      validationResponse.status === "VALIDATED"
    ) {
      await OrderService.updateOrderStatus(String(order._id), {
        paymentStatus: "paid",
        orderStatus: "confirmed", // ✅ better than leaving it pending
      });
      return res.redirect(`${CLIENT_BASE_URL}/payment/success`);
    } else {
      await OrderService.updateOrderStatus(String(order._id), {
        paymentStatus: "failed",
        orderStatus: "cancelled",
      });
      return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
    }
  } catch (error) {
    console.error("❌ Payment success handling failed:", error);
    if (req.params.tran_id) {
      const order = await Order.findOne({ transactionId: req.params.tran_id });
      if (order) {
        await OrderService.updateOrderStatus(String(order._id), {
          paymentStatus: "failed",
          orderStatus: "cancelled",
        });
      }
    }
    return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
  }
};

// Payment Fail Handler
export const paymentFail = async (req: Request, res: Response) => {
  try {
    console.log("Payment fail request:", req.params); // Debug log
    const { tran_id } = req.params;
    const order = await Order.findOne({ transactionId: tran_id });

    if (order) {
      await OrderService.cancelOrder(String(order._id));
    }
    return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
  } catch (error) {
    console.error("❌ Payment fail handling failed:", error);
    return res.redirect(`${CLIENT_BASE_URL}/payment/fail`);
  }
};

// Payment Cancel Handler
export const paymentCancel = async (req: Request, res: Response) => {
  try {
    console.log("Payment cancel request:", req.params); // Debug log
    const { tran_id } = req.params;
    const order = await Order.findOne({ transactionId: tran_id });

    if (order) {
      await OrderService.cancelOrder(String(order._id));
    }
    return res.redirect(`${CLIENT_BASE_URL}/payment/cancel`);
  } catch (error) {
    console.error("❌ Payment cancel handling failed:", error);
    return res.redirect(`${CLIENT_BASE_URL}/payment/cancel`);
  }
};

// IPN Handler
export const paymentIPN = async (req: Request, res: Response) => {
  try {
    const { tran_id, status, val_id } = req.body;

    const order = await Order.findOne({ transactionId: tran_id });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (status === "VALID" || status === "VALIDATED") {
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const validationResponse = await sslcz.validate({ val_id });

      if (
        validationResponse.status === "VALID" ||
        validationResponse.status === "VALIDATED"
      ) {
        await OrderService.updateOrderStatus(String(order._id), {
          paymentStatus: "paid",
          // status: "confirmed",
        });
      } else {
        await OrderService.cancelOrder(String(order._id));
      }
    } else {
      await OrderService.cancelOrder(String(order._id));
    }

    return res.status(200).json({ success: true, message: "IPN processed" });
  } catch (error) {
    console.error("❌ IPN handling failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "IPN processing failed" });
  }
};
