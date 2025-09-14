"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const product_model_1 = require("./product.model");
class ProductService {
    async createProduct(productData) {
        const product = new product_model_1.Product(productData);
        return await product.save();
    }
    async getFilterOptions() {
        const brands = await product_model_1.Product.distinct("brand");
        const categories = await product_model_1.Product.distinct("category");
        const tags = await product_model_1.Product.distinct("tags");
        // FIXED: Use 'size' (singular) instead of 'sizes' (plural)
        const sizes = await product_model_1.Product.distinct("size");
        return {
            brands: brands.filter(Boolean),
            categories: categories.filter(Boolean),
            tags: tags.filter(Boolean),
            sizes: sizes.filter(Boolean),
        };
    }
    // New Added
    async getProducts(filter, skip, limit, sort) {
        // Merge filter with default user filter
        const userFilter = {
            ...filter,
            $or: [{ isActive: true }, { isActive: { $exists: false } }],
        };
        return await product_model_1.Product.find(userFilter).skip(skip).limit(limit).sort(sort);
    }
    async countProducts(filter) {
        const userFilter = {
            ...filter,
            $or: [{ isActive: true }, { isActive: { $exists: false } }],
        };
        return await product_model_1.Product.countDocuments(userFilter);
    }
    async getAllProductsForAdmin() {
        return await product_model_1.Product.find({}).sort({ createdAt: -1 });
    }
    async getProductById(id) {
        return await product_model_1.Product.findById(id).populate("createdBy", "name email");
    }
    async getProductBySlug(slug) {
        const product = await product_model_1.Product.findOne({ slug }).lean();
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }
    async updateProduct(id, updateData) {
        if (!id)
            throw new Error("Product ID is required");
        return await product_model_1.Product.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true, runValidators: true });
    }
    async deleteProduct(id) {
        return await product_model_1.Product.findByIdAndDelete(id);
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
