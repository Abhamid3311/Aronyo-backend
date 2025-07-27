import { Types } from "mongoose";

export interface IReview {
  userId: Types.ObjectId; // Reference to User
  productId: Types.ObjectId; // Reference to Product
  rating: number; // e.g. 1 to 5
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
