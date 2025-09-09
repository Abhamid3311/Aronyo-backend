"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const category_service_1 = require("./category.service");
const sendErrorResponse_1 = require("../../../utils/sendErrorResponse");
exports.categoryController = {
    async createCategory(req, res) {
        try {
            const userId = req.user?.userId;
            const categoryData = { ...req.body, createdBy: userId };
            const category = await category_service_1.CategoryService.createCategory(categoryData);
            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: category,
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getCategoriesAdmin(req, res) {
        try {
            const categoris = await category_service_1.CategoryService.getAllCategoriesForAdmin();
            res.status(200).json({ success: true, data: categoris });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getAllCategories(req, res) {
        try {
            const categories = await category_service_1.CategoryService.getAllCategories();
            res.status(200).json({
                success: true,
                data: categories,
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async getSingleCategory(req, res) {
        try {
            const id = req.params.id;
            const category = await category_service_1.CategoryService.getSingleCategory(id);
            res.status(200).json({
                success: true,
                data: category,
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async updateCategory(req, res) {
        try {
            const id = req.params.id;
            const updateData = req.body;
            const updatedCategory = await category_service_1.CategoryService.updateCategory(id, updateData);
            res.status(200).json({
                success: true,
                message: "Category updated successfully",
                data: updatedCategory,
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
    async deleteCategory(req, res) {
        try {
            const id = req.params.id;
            await category_service_1.CategoryService.deleteCategory(id);
            res.status(200).json({
                success: true,
                message: "Category deleted successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    },
};
