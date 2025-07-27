import { Types } from "mongoose";

export interface IProduct {
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  brand?: string;
  images: string[];
  stock: number;
  tags: string[];
  ratings: number;
  numReviews: number;
  size?: string;
  createdBy: Types.ObjectId;
  createdAt?: Date;
}
