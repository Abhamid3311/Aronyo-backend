import { Order } from "./order.model";
import { IOrder } from "./order.interface";

export const OrderService = {
  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    const order = await Order.create(orderData);
    return order;
  },

  async getAllOrders(userId: string): Promise<IOrder[]> {
    return await Order.find({
      user: userId,
      orderStatus: { $ne: "cancelled" }, // 🚫 exclude cancelled
    })
      .populate("orderItems.product")
      .populate("user", "name email")
      .sort({ createdAt: -1 }); // ✅ newest first
  },

  async getAllOrdersAdmin(
    skip: number,
    limit: number
  ): Promise<{ orders: IOrder[]; total: number }> {
    const [orders, total] = await Promise.all([
      Order.find()
        .populate("orderItems.product")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Order.countDocuments(),
    ]);
    return { orders, total };
  },

  async getSingleOrder(orderId: string): Promise<IOrder | null> {
    return await Order.findById(orderId)
      .populate("orderItems.product")
      .populate("user", "name email");
  },
  
  async updateOrderStatus(
    orderId: string,
    statusData: { orderStatus?: string; paymentStatus?: string }
  ): Promise<IOrder | null> {
    const order = await Order.findById(orderId);
    if (!order) return null;

    if (
      order.paymentMethod === "cod" &&
      statusData.orderStatus === "delivered"
    ) {
      statusData.paymentStatus = "paid";
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      statusData,
      { new: true, runValidators: true }
    ).populate("orderItems.product");

    return updatedOrder;
  },

  async cancelOrder(orderId: string): Promise<IOrder | null> {
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.orderStatus !== "pending") {
      throw new Error("Only pending orders can be cancelled");
    }
    return await Order.findOneAndUpdate(
      { _id: orderId },
      { orderStatus: "cancelled" },
      { new: true, runValidators: true }
    ).populate("orderItems.product");
  },
};
