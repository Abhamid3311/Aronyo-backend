import { Blog } from "./blog.model";
import { IBlog } from "./blog.interface";
import { FilterQuery } from "mongoose";

class BlogService {
  async createBlog(blogData: IBlog) {
    const blog = new Blog(blogData);
    return await blog.save();
  }

  async getBlogs(
    filter: FilterQuery<IBlog>,
    skip: number,
    limit: number,
    sort: string
  ) {
    const finalFilter = { ...filter, isPublished: true };

    return await Blog.find(finalFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email image");
  }

  async getAllBlogsForAdmin(): Promise<IBlog[]> {
    return await Blog.find({})
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");
  }

  async countBlogs(filter: FilterQuery<IBlog>) {
    return await Blog.countDocuments(filter);
  }

  async getBlogById(id: string) {
    return await Blog.findById(id).populate("createdBy", "name email image");
  }

  async updateBlog(id: string, updateData: Partial<IBlog>) {
    return await Blog.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteBlog(id: string) {
    return await Blog.findByIdAndDelete(id);
  }
}

export const blogService = new BlogService();
