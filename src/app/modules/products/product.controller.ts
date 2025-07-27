/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { productService } from "./product.service";
import { IProduct, IQueryParams } from "./product.interface";
import { FilterQuery } from "mongoose";
import { sendErrorResponse } from "../../../utils/sendErrorResponse";

class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const productData: IProduct = req.body;
      const product = await productService.createProduct(productData);

      res.status(200).json({
        success: true,
        data: product,
        message: "Product created successfully",
      });
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const queryParams: IQueryParams = req.query;

      const page = parseInt(queryParams.page || "1");
      const limit = parseInt(queryParams.limit || "10");
      const skip = (page - 1) * limit;

      const filter: FilterQuery<IProduct> = {};

      // Search functionality
      if (queryParams.search) {
        filter.$or = [
          { title: { $regex: queryParams.search, $options: "i" } },
          { description: { $regex: queryParams.search, $options: "i" } },
          { brand: { $regex: queryParams.search, $options: "i" } },
        ];
      }

      // Filter by category
      if (queryParams.category) {
        filter.category = queryParams.category;
      }

      // Filter by brand
      if (queryParams.brand) {
        filter.brand = { $regex: queryParams.brand, $options: "i" };
      }

      // Price range filter
      if (queryParams.minPrice || queryParams.maxPrice) {
        filter.price = {};
        if (queryParams.minPrice) {
          filter.price.$gte = parseFloat(queryParams.minPrice);
        }
        if (queryParams.maxPrice) {
          filter.price.$lte = parseFloat(queryParams.maxPrice);
        }
      }

      // Sorting
      const sort = queryParams.sort || "-createdAt";

      const [products, total] = await Promise.all([
        productService.getProducts(filter, skip, limit, sort),
        productService.countProducts(filter),
      ]);

      res.status(200).json({
        success: true,
        data: products,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const product = await productService.getProductById(req.params.id);

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body
      );

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.status(200).json({
        success: true,
        data: product,
        message: "Product updated successfully",
      });
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await productService.deleteProduct(req.params.id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      };

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }
}

export const productController = new ProductController();
