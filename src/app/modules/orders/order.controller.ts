import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { sendErrorResponse } from "../../../utils/sendErrorResponse";
import { CartService } from "../cart/cart.service";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../products/product.model";

interface IQueryParams {
  page?: string;
  limit?: string;
}

export const orderController = {
  
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new Error("User not authenticated");

      const { shippingAddress, paymentMethod, deliveryCharge = 0 } = req.body;
      if (!shippingAddress || !paymentMethod) {
        throw new Error("Shipping address and payment method required");
      }

      // 1️⃣ Get cart
      const cart = await CartService.getCart(userId);
      if (!cart || !cart.items.length) {
        throw new Error("Cart is empty");
      }

      // 2️⃣ Build order items
      const orderItems = await Promise.all(
        cart.items.map(async (item) => {
          const product = await Product.findById(item.productId);
          if (!product) throw new Error(`Product not found`);
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.title}`);
          }
          return {
            product: item.productId,
            quantity: item.quantity,
            price: product.price,
          };
        })
      );

      // 3️⃣ Totals
      const totalAmount = orderItems.reduce(
        (sum, i) => sum + i.quantity * i.price,
        0
      );
      const totalPayable = totalAmount + deliveryCharge;

      // 4️⃣ Transaction ID
      const transactionId = "TXN-" + Date.now() + "-" + uuidv4().slice(0, 8);

      // 5️⃣ Save order via Service
      const order = await OrderService.createOrder({
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
      });

      // 6️⃣ Clear cart
      await CartService.clearCart(userId);

      // ✅ Response
      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const orders = await OrderService.getAllOrders(userId);
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getAllOrdersAdmin(req: Request, res: Response): Promise<void> {
    try {
      const queryParams: IQueryParams = req.query;
      const page = parseInt(queryParams.page || "1");
      const limit = parseInt(queryParams.limit || "10");
      const skip = (page - 1) * limit;

      const { orders, total } = await OrderService.getAllOrdersAdmin(
        skip,
        limit
      );
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
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getSingleOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const orderId = req.params.orderId;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const order = await OrderService.getSingleOrder(orderId, userId);
      if (!order) {
        throw new Error("Order not found");
      }
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const statusData = req.body;
      if (!statusData.orderStatus && !statusData.paymentStatus) {
        throw new Error("Order status or payment status is required");
      }
      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        statusData
      );
      if (!updatedOrder) {
        throw new Error("Order not found");
      }
      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: updatedOrder,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const order = await OrderService.cancelOrder(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};
