import { Types, Document } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  city?: string;
  area?: string;
  address: string;
  deliveryNotes?: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId | string;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: "cod" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  deliveryCharge: number;
  totalPayable: number;
  transactionId: string;
  isReviewed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
