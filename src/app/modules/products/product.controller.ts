/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { productService } from "./product.service";
import { IProduct } from "./product.interface";
import { FilterQuery } from "mongoose";
import { sendErrorResponse } from "../../../utils/sendErrorResponse";

class ProductController {
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData = req.body;
      const userPayload = (req as any).user;

      if (!userPayload) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      // Set createdBy from token's userId
      productData.createdBy = userPayload.userId;
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

  //  Get filter options for frontend dropdowns
  async getFilterOptions(req: Request, res: Response) {
    try {
      const filters = await productService.getFilterOptions();

      res.status(200).json({
        success: true,
        data: filters,
        message: "Filter options fetched successfully",
      });
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const queryParams = req.query as Record<string, any>;

      const page = parseInt(queryParams.page || "1");
      const limit = parseInt(queryParams.limit || "12");
      const skip = (page - 1) * limit;

      const filter: FilterQuery<IProduct> = {};
      const andConditions: any[] = [];

      // Search - FIXED: Use $or instead of $and
      if (queryParams.search && queryParams.search.trim()) {
        andConditions.push({
          $or: [
            { title: { $regex: queryParams.search.trim(), $options: "i" } },
            {
              description: { $regex: queryParams.search.trim(), $options: "i" },
            },
            { brand: { $regex: queryParams.search.trim(), $options: "i" } },
            { category: { $regex: queryParams.search.trim(), $options: "i" } },
          ],
        });
      }

      //  Multi-size filter - FIXED: Use 'size' (singular) not 'sizes'
      if (queryParams.size && queryParams.size.trim()) {
        const sizes = Array.isArray(queryParams.size)
          ? queryParams.size
          : queryParams.size
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);

        if (sizes.length > 0) {
          filter.size = { $in: sizes };
        }
      }

      // Category
      if (queryParams.category && queryParams.category.trim()) {
        filter.category = queryParams.category.trim();
      }

      //  Multi-brand filter
      if (queryParams.brand && queryParams.brand.trim()) {
        const brands = Array.isArray(queryParams.brand)
          ? queryParams.brand
          : queryParams.brand
              .split(",")
              .map((b: string) => b.trim())
              .filter(Boolean);

        if (brands.length > 0) {
          filter.brand = { $in: brands.map((b: string) => new RegExp(b, "i")) };
        }
      }

      // Multi-tag filter
      if (queryParams.tags && queryParams.tags.trim()) {
        const tags = Array.isArray(queryParams.tags)
          ? queryParams.tags
          : queryParams.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean);

        if (tags.length > 0) {
          filter.tags = { $in: tags };
        }
      }

      // Price range
      if (queryParams.minPrice || queryParams.maxPrice) {
        filter.price = {};
        if (queryParams.minPrice) {
          filter.price.$gte = parseFloat(queryParams.minPrice);
        }
        if (queryParams.maxPrice) {
          filter.price.$lte = parseFloat(queryParams.maxPrice);
        }
      }

      // Combine search with other filters
      if (andConditions.length > 0) {
        filter.$and = andConditions;
      }

      //  Sorting
      const sort = queryParams.sort || "-createdAt";

      //  Query DB
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
      console.error(" Error in getProducts:", error);
      sendErrorResponse(error, res);
    }
  }

  async getProductsAdmin(req: Request, res: Response) {
    try {
      const products = await productService.getAllProductsForAdmin();
      res.status(200).json({ success: true, data: products });
    } catch (error) {
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
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }

  async getProductBySlug(req: Request, res: Response): Promise<void> {
    try {
      const product = await productService.getProductBySlug(req.params.slug);

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
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
        return;
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
        return;
      }

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
