import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { sendErrorResponse } from "../../../utils/sendErrorResponse";

interface IQueryParams {
  page?: string;
  limit?: string;
}

export const orderController = {
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new Error("User not authenticated");

      const orderData = req.body;
      if (!orderData.shippingAddress || !orderData.paymentMethod) {
        throw new Error("Shipping address and payment method required");
      }

      const order = await OrderService.createOrder(userId, orderData);

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
