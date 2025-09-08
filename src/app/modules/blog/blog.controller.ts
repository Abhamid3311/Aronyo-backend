/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { blogService } from "./blog.service";
import { IBlog, IQueryParams } from "./blog.interface";
import { FilterQuery } from "mongoose";
import { sendErrorResponse } from "../../../utils/sendErrorResponse";

class BlogController {
  async createBlog(req: Request, res: Response): Promise<void> {
    try {
      const blogData: IBlog = req.body;
      const userPayload = (req as any).user;

      if (!userPayload) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      blogData.author = userPayload.userId;
      blogData.createdBy = userPayload.userId;

      const blog = await blogService.createBlog(blogData);

      res.status(200).json({
        success: true,
        data: blog,
        message: "Blog created successfully",
      });
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }

  async getBlogs(req: Request, res: Response) {
    try {
      const queryParams: IQueryParams = req.query;
      const page = parseInt(queryParams.page || "1");
      const limit = parseInt(queryParams.limit || "10");
      const skip = (page - 1) * limit;

      const filter: FilterQuery<IBlog> = {};

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
        blogService.getBlogs(filter, skip, limit, sort),
        blogService.countBlogs(filter),
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
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }

  async getBlogById(req: Request, res: Response): Promise<void> {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      if (!blog) {
        res.status(404).json({ success: false, message: "Blog not found" });
        return;
      }
      res.status(200).json({ success: true, data: blog });
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }

  async updateBlog(req: Request, res: Response): Promise<void> {
    try {
      const blog = await blogService.updateBlog(req.params.id, req.body);
      if (!blog) {
        res.status(404).json({ success: false, message: "Blog not found" });
        return;
      }
      res.status(200).json({
        success: true,
        data: blog,
        message: "Blog updated successfully",
      });
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }

  async deleteBlog(req: Request, res: Response): Promise<void> {
    try {
      const blog = await blogService.deleteBlog(req.params.id);
      if (!blog) {
        res.status(404).json({ success: false, message: "Blog not found" });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
      });
    } catch (error: any) {
      sendErrorResponse(error, res);
    }
  }
}

export const blogController = new BlogController();
