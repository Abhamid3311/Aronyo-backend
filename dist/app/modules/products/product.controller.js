"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const product_service_1 = require("./product.service");
const sendErrorResponse_1 = require("../../../utils/sendErrorResponse");
class ProductController {
    async createProduct(req, res) {
        try {
            const productData = req.body;
            const userPayload = req.user;
            if (!userPayload) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }
            // Set createdBy from token's userId
            productData.createdBy = userPayload.userId;
            const product = await product_service_1.productService.createProduct(productData);
            res.status(200).json({
                success: true,
                data: product,
                message: "Product created successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
    //  Get filter options for frontend dropdowns
    async getFilterOptions(req, res) {
        try {
            const filters = await product_service_1.productService.getFilterOptions();
            res.status(200).json({
                success: true,
                data: filters,
                message: "Filter options fetched successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
    async getProducts(req, res) {
        try {
            const queryParams = req.query;
            const page = parseInt(queryParams.page || "1");
            const limit = parseInt(queryParams.limit || "12");
            const skip = (page - 1) * limit;
            const filter = {};
            const andConditions = [];
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
                        .map((s) => s.trim())
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
                        .map((b) => b.trim())
                        .filter(Boolean);
                if (brands.length > 0) {
                    filter.brand = { $in: brands.map((b) => new RegExp(b, "i")) };
                }
            }
            // Multi-tag filter
            if (queryParams.tags && queryParams.tags.trim()) {
                const tags = Array.isArray(queryParams.tags)
                    ? queryParams.tags
                    : queryParams.tags
                        .split(",")
                        .map((t) => t.trim())
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
                product_service_1.productService.getProducts(filter, skip, limit, sort),
                product_service_1.productService.countProducts(filter),
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
        }
        catch (error) {
            console.error(" Error in getProducts:", error);
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
    async getProductsAdmin(req, res) {
        try {
            const products = await product_service_1.productService.getAllProductsForAdmin();
            res.status(200).json({ success: true, data: products });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
    async getProductById(req, res) {
        try {
            const product = await product_service_1.productService.getProductById(req.params.id);
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
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
    async getProductBySlug(req, res) {
        try {
            const product = await product_service_1.productService.getProductBySlug(req.params.slug);
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
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
    async updateProduct(req, res) {
        try {
            const product = await product_service_1.productService.updateProduct(req.params.id, req.body);
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
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
    async deleteProduct(req, res) {
        try {
            const product = await product_service_1.productService.deleteProduct(req.params.id);
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
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
}
exports.productController = new ProductController();
