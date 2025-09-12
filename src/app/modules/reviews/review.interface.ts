import { Types } from "mongoose";

export interface IReview {
  userId?: Types.ObjectId;
  orderId?: Types.ObjectId;
  rating: number;
  comment: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
