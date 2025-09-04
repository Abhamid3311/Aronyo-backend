import { Category } from "./category.model";
import { ICategory } from "./category.interface";

class CategoryServiceClass {
  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    const category = await Category.create(categoryData);
    return category;
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await Category.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async getAllCategoriesForAdmin(): Promise<ICategory[]> {
    return await Category.find({});
  }

  async getSingleCategory(slug: string): Promise<ICategory | null> {
    return await Category.findOne({ slug, isActive: true });
  }

  async updateCategory(
    slug: string,
    updateData: Partial<ICategory>
  ): Promise<ICategory | null> {
    return await Category.findOneAndUpdate({ slug }, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteCategory(slug: string): Promise<void> {
    // soft delete or hard delete (hard delete here)
    await Category.findOneAndDelete({ slug });
  }
}

export const CategoryService = new CategoryServiceClass();
