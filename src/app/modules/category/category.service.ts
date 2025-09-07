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

  async getSingleCategory(id: string): Promise<ICategory | null> {
    return await Category.findById(id).populate("createdBy", "name email");
  }

  async updateCategory(
    id: string,
    updateData: Partial<ICategory>
  ): Promise<ICategory | null> {
    return await Category.findOneAndUpdate(
      { _id: id }, // ✅ use _id
      updateData,
      {
        new: true, // return updated doc
        runValidators: true,
      }
    );
  }

  async deleteCategory(id: string) {
    return await Category.findByIdAndDelete(id);
  }
}

export const CategoryService = new CategoryServiceClass();
