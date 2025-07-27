import { Types } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdBy?: Types.ObjectId;
}
