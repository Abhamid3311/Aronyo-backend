import { Types } from "mongoose";

export interface IBlog {
  image: string;
  title: string;
  subTitle?: string;
  description: string;
  tags?: string[];
  category: string;
  slug?: string;
  author?: Types.ObjectId | string;
  isPublished: boolean;
  createdBy?: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  tag?: string | string[];
  sort?: string;
}
