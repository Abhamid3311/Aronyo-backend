import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { categoryController } from "./category.controller";

const router = express.Router();

router.post(
  "/create-category",
  authMiddleware(["admin"]),
  categoryController.createCategory
);

router.get("/", categoryController.getAllCategories);
router.get("/admin/all-categories", categoryController.getCategoriesAdmin);
router.get("/:slug", categoryController.getSingleCategory);

router.patch(
  "/:slug",
  authMiddleware(["admin"]),
  categoryController.updateCategory
);

router.delete(
  "/:slug",
  authMiddleware(["admin"]),
  categoryController.deleteCategory
);

export const CategoryRoutes = router;
