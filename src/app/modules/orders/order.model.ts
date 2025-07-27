/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from "mongoose";
import { IOrder, IOrderItem, IShippingAddress } from "./order.interface";
import { Product } from "../products/product.model";

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
});

const shippingAddressSchema = new Schema<IShippingAddress>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  area: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
});

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: [true, "Payment method is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    deliveryCharge: {
      type: Number,
      required: [true, "Delivery charge is required"],
      min: [0, "Delivery charge cannot be negative"],
    },
    totalPayable: {
      type: Number,
      required: [true, "Total payable is required"],
      min: [0, "Total payable cannot be negative"],
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔄 Pre-save hook to validate products, stock, and totalPayable
orderSchema.pre("save", async function (next) {
  // Validate products and stock
  for (const item of this.orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product with ID ${item.product} not found`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.title}`);
    }
  }

  // Validate totalPayable
  const calculatedTotal = this.orderItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  if (this.totalAmount !== calculatedTotal) {
    throw new Error("Total amount does not match order items");
  }
  if (this.totalPayable !== this.totalAmount + this.deliveryCharge) {
    throw new Error(
      "Total payable does not match total amount + delivery charge"
    );
  }
  next();
});

// 🔄 Pre-update hook to validate status transitions
orderSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  if (update.orderStatus) {
    const currentOrder = await this.model.findOne(this.getQuery());
    if (!currentOrder) {
      throw new Error("Order not found");
    }
    const validTransitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };
    if (
      !validTransitions[currentOrder.orderStatus].includes(update.orderStatus)
    ) {
      throw new Error(
        `Invalid status transition from ${currentOrder.orderStatus} to ${update.orderStatus}`
      );
    }
  }
  next();
});

// 🔄 Add indexes for performance
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ transactionId: 1 }, { unique: true });

export const Order = model<IOrder>("Order", orderSchema);
