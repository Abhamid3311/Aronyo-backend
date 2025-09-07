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
    // Merge filter with default user filter
    const userFilter = {
      ...filter,
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    };

    return await Product.find(userFilter).skip(skip).limit(limit).sort(sort);
  }

  async getAllProductsForAdmin(): Promise<IProduct[]> {
    return await Product.find({}).sort({ createdAt: -1 });
  }

  async countProducts(filter: FilterQuery<IProduct>) {
    return await Product.countDocuments(filter);
  }

  async getProductById(id: string) {
    return await Product.findById(id).populate("createdBy", "name email");
    // return await Product.findById(id);
  }

  async getProductBySlug(slug: string) {
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async updateProduct(
    id: string,
    updateData: Partial<IProduct>
  ): Promise<IProduct | null> {
    if (!id) throw new Error("Product ID is required");
    return await Product.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async deleteProduct(id: string) {
    return await Product.findByIdAndDelete(id);
  }
}

export const productService = new ProductService();
