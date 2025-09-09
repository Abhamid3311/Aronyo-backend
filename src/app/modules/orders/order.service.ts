import { Order } from "./order.model";
import { IOrder } from "./order.interface";
import { Product } from "../products/product.model";
import { v4 as uuidv4 } from "uuid";
import { CartService } from "../cart/cart.service";

export const OrderService = {
  async createOrder(
    userId: string,
    orderData: Partial<IOrder>
  ): Promise<IOrder> {
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
    const deliveryCharge = orderData.deliveryCharge || 0;
    const totalPayable = totalAmount + deliveryCharge;

    // 4️⃣ Transaction ID
    const transactionId = "TXN-" + Date.now() + "-" + uuidv4().slice(0, 8);

    // 5️⃣ Save order
    const order = await Order.create({
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
    await CartService.clearCart(userId);

    return order;
  },

  async getAllOrders(userId: string): Promise<IOrder[]> {
    return await Order.find({ user: userId })
      .populate("orderItems.product")
      .populate("user", "username email");
  },

  async getAllOrdersAdmin(
    skip: number,
    limit: number
  ): Promise<{ orders: IOrder[]; total: number }> {
    const [orders, total] = await Promise.all([
      Order.find()
        .populate("orderItems.product")
        .populate("user", "name email")
        .skip(skip)
        .limit(limit),
      Order.countDocuments(),
    ]);
    return { orders, total };
  },

  async getSingleOrder(
    orderId: string,
    userId: string
  ): Promise<IOrder | null> {
    return await Order.findOne({ _id: orderId, user: userId })
      .populate("orderItems.product")
      .populate("user", "username email");
  },

  async updateOrderStatus(
    orderId: string,
    statusData: { orderStatus?: string; paymentStatus?: string }
  ): Promise<IOrder | null> {
    return await Order.findOneAndUpdate({ _id: orderId }, statusData, {
      new: true,
      runValidators: true,
    }).populate("orderItems.product");
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
