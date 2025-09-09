"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const blog_service_1 = require("./blog.service");
const sendErrorResponse_1 = require("../../../utils/sendErrorResponse");
class BlogController {
    async createBlog(req, res) {
        try {
            const blogData = req.body;
            const userPayload = req.user;
            if (!userPayload) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }
            blogData.createdBy = userPayload.userId;
            const blog = await blog_service_1.blogService.createBlog(blogData);
            res.status(200).json({
                success: true,
                data: blog,
                message: "Blog created successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
    async getBlogs(req, res) {
        try {
            const queryParams = req.query;
            const page = parseInt(queryParams.page || "1");
            const limit = parseInt(queryParams.limit || "10");
            const skip = (page - 1) * limit;
            const filter = {};
            if (queryParams.search) {
                filter.$or = [
                    { title: { $regex: queryParams.search, $options: "i" } },
                    { description: { $regex: queryParams.search, $options: "i" } },
                    { subTitle: { $regex: queryParams.search, $options: "i" } },
                ];
            }
            if (queryParams.category) {
                filter.category = queryParams.category;
            }
            if (queryParams.tag) {
                const tags = Array.isArray(queryParams.tag)
                    ? queryParams.tag
                    : queryParams.tag.split(",");
                filter.tags = { $in: tags };
            }
            const sort = queryParams.sort || "-createdAt";
            const [blogs, total] = await Promise.all([
                blog_service_1.blogService.getBlogs(filter, skip, limit, sort),
                blog_service_1.blogService.countBlogs(filter),
            ]);
            res.status(200).json({
                success: true,
                data: blogs,
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
    async getBlogsAdmin(req, res) {
        try {
            const blogs = await blog_service_1.blogService.getAllBlogsForAdmin();
            res.status(200).json({ success: true, data: blogs });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
    async getBlogById(req, res) {
        try {
            const blog = await blog_service_1.blogService.getBlogById(req.params.id);
            if (!blog) {
                res.status(404).json({ success: false, message: "Blog not found" });
                return;
            }
            res.status(200).json({ success: true, data: blog });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
    async updateBlog(req, res) {
        try {
            const blog = await blog_service_1.blogService.updateBlog(req.params.id, req.body);
            if (!blog) {
                res.status(404).json({ success: false, message: "Blog not found" });
                return;
            }
            res.status(200).json({
                success: true,
                data: blog,
                message: "Blog updated successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
    async deleteBlog(req, res) {
        try {
            const blog = await blog_service_1.blogService.deleteBlog(req.params.id);
            if (!blog) {
                res.status(404).json({ success: false, message: "Blog not found" });
                return;
            }
            res.status(200).json({
                success: true,
                message: "Blog deleted successfully",
            });
        }
        catch (error) {
            (0, sendErrorResponse_1.sendErrorResponse)(error, res);
        }
    }
}
exports.blogController = new BlogController();
