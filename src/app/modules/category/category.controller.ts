import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { sendErrorResponse } from "../../../utils/sendErrorResponse";

export const categoryController = {
  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const categoryData = { ...req.body, createdBy: userId };

      const category = await CategoryService.createCategory(categoryData);
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getCategoriesAdmin(req: Request, res: Response) {
    try {
      const categoris = await CategoryService.getAllCategoriesForAdmin();
      res.status(200).json({ success: true, data: categoris });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getSingleCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const category = await CategoryService.getSingleCategory(id);
      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const updateData = req.body;

      const updatedCategory = await CategoryService.updateCategory(
        id,
        updateData
      );
      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async updateStatusCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const updatedCategory = await CategoryService.updateStatusCategory(id);

      res.status(200).json({
        success: true,
        message: `Category Status Updated successfully`,
        data: updatedCategory,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await CategoryService.deleteCategory(id);
      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};
