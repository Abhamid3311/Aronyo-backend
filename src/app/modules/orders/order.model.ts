import { Schema, model } from "mongoose";
import { IOrder, IOrderItem, IShippingAddress } from "./order.interface";

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const shippingAddressSchema = new Schema<IShippingAddress>({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  city: { type: String, trim: true },
  area: { type: String, trim: true },
  address: { type: String, required: true, trim: true },
});

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,

    // 🔥 both allowed, only saved, no gateway flow yet
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },

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

    totalAmount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    totalPayable: { type: Number, required: true },

    transactionId: { type: String, unique: true },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);
