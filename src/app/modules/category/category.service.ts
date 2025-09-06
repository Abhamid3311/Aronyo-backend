import { Category } from "./category.model";
import { ICategory } from "./category.interface";

class CategoryServiceClass {
  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    const category = await Category.create(categoryData);
    return category;
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await Category.find(
      { isActive: true }, // filter
      { _id: 1, name: 1, slug: 1, image: 1 }
    ).sort({ createdAt: -1 });
  }

  async getAllCategoriesForAdmin(): Promise<ICategory[]> {
    return await Category.find({}).sort({ createdAt: -1 });
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

  async updateStatusCategory(id: string): Promise<ICategory | null> {
    // Find the category and toggle isActive
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { isActive: !category.isActive },
      { new: true, runValidators: true }
    );

    return updatedCategory;
  }

  async deleteCategory(id: string) {
    return await Category.findByIdAndDelete(id);
  }
}

export const CategoryService = new CategoryServiceClass();
