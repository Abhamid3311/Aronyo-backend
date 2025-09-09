"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogService = void 0;
const blog_model_1 = require("./blog.model");
class BlogService {
    async createBlog(blogData) {
        const blog = new blog_model_1.Blog(blogData);
        return await blog.save();
    }
    async getBlogs(filter, skip, limit, sort) {
        const finalFilter = { ...filter, isPublished: true };
        return await blog_model_1.Blog.find(finalFilter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "name email image");
    }
    async getAllBlogsForAdmin() {
        return await blog_model_1.Blog.find({})
            .sort({ createdAt: -1 })
            .populate("createdBy", "name");
    }
    async countBlogs(filter) {
        return await blog_model_1.Blog.countDocuments(filter);
    }
    async getBlogById(id) {
        return await blog_model_1.Blog.findById(id).populate("createdBy", "name email image");
    }
    async updateBlog(id, updateData) {
        return await blog_model_1.Blog.findByIdAndUpdate(id, updateData, { new: true });
    }
    async deleteBlog(id) {
        return await blog_model_1.Blog.findByIdAndDelete(id);
    }
}
exports.blogService = new BlogService();
