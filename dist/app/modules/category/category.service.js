"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_model_1 = require("./category.model");
class CategoryServiceClass {
    async createCategory(categoryData) {
        const category = await category_model_1.Category.create(categoryData);
        return category;
    }
    async getAllCategories() {
        return await category_model_1.Category.find({ isActive: true }, // filter
        { _id: 1, name: 1, slug: 1, image: 1 }).sort({ createdAt: -1 });
    }
    async getAllCategoriesForAdmin() {
        return await category_model_1.Category.find({}).sort({ createdAt: -1 });
    }
    async getSingleCategory(id) {
        return await category_model_1.Category.findById(id).populate("createdBy", "name email");
    }
    async updateCategory(id, updateData) {
        return await category_model_1.Category.findOneAndUpdate({ _id: id }, // ✅ use _id
        updateData, {
            new: true, // return updated doc
            runValidators: true,
        });
    }
    async deleteCategory(id) {
        return await category_model_1.Category.findByIdAndDelete(id);
    }
}
exports.CategoryService = new CategoryServiceClass();
