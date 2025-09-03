import { Types } from "mongoose";

export interface IProduct {
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand?: string;
  images: string[];
  stock: number;
  tags?: string[];
  ratings: number;
  numReviews: number;
  size?: string;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  isActive: boolean;
}

export interface IQueryParams {
  page?: string;
  limit?: string;
  sort?: string;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  tag?: string | string[];
}
