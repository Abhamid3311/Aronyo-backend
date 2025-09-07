import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { categoryController } from "./category.controller";

const router = express.Router();

router.get("/", categoryController.getAllCategories);

router.post(
  "/create-category",
  authMiddleware(["admin"]),
  categoryController.createCategory
);

router.get(
  "/admin/all-categories",
  authMiddleware(["admin"]),
  categoryController.getCategoriesAdmin
);

router.get(
  "/:id",
  authMiddleware(["admin"]),
  categoryController.getSingleCategory
);

router.put(
  "/:id",
  authMiddleware(["admin"]),
  categoryController.updateCategory
);



router.delete(
  "/:id",
  authMiddleware(["admin"]),
  categoryController.deleteCategory
);

export const CategoryRoutes = router;
