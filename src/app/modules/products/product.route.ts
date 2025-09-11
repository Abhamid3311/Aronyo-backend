import { Router } from "express";
import { productController } from "./product.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/filters", productController.getFilterOptions);
router.get("/", productController.getProducts);

router.get(
  "/admin/all-products",
  authMiddleware(["admin", "staff"]),
  productController.getProductsAdmin
);

router.post(
  "/create-product",
  authMiddleware(["admin", "staff"]),
  productController.createProduct
);

router.put(
  "/update-product/:id",
  authMiddleware(["admin", "staff"]),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware(["admin", "staff"]),
  productController.deleteProduct
);

router.get("/:slug", productController.getProductBySlug);

router.get(
  "/admin/:id",
  authMiddleware(["admin", "staff"]),
  productController.getProductById
);

export const productRoutes = router;
