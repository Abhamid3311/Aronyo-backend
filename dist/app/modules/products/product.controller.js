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
    async getProducts(req, res) {
        try {
            const queryParams = req.query;
            const page = parseInt(queryParams.page || "1");
            const limit = parseInt(queryParams.limit || "12");
            const skip = (page - 1) * limit;
            const filter = {};
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
            // ✅ Filter by tag (support multiple tags)
            if (queryParams.tag) {
                const tags = Array.isArray(queryParams.tag)
                    ? queryParams.tag
                    : queryParams.tag.split(","); // support comma-separated tags
                filter.tags = { $in: tags };
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
