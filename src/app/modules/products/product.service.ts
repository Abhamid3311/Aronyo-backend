import { FilterQuery } from "mongoose";
import { Product } from "./product.model";
import { IProduct } from "./product.interface";

export class ProductService {
  async createProduct(productData: IProduct) {
    const product = new Product(productData);
    return await product.save();
  }

  async getProducts(
    filter: FilterQuery<IProduct>,
    skip: number,
    limit: number,
    sort: string
  ) {
    return await Product.find(filter)
      .populate("category")
      .populate("createdBy")
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async countProducts(filter: FilterQuery<IProduct>) {
    return await Product.countDocuments(filter);
  }

  async getProductById(id: string) {
    return await Product.findById(id)
      .populate("category")
      .populate("createdBy");
  }

  async updateProduct(id: string, updateData: Partial<IProduct>) {
    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteProduct(id: string) {
    return await Product.findByIdAndDelete(id);
  }
}

export const productService = new ProductService();
