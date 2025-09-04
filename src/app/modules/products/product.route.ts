import { Router } from "express";
import { productController } from "./product.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", productController.getProducts);

router.post(
  "/create-product",
  authMiddleware(["admin", "staff"]),
  productController.createProduct
);

router.get(
  "/admin",
  authMiddleware(["admin", "staff"]),
  productController.getProductsAdmin
);
router.patch(
  "/update-product/:id",
  authMiddleware(["admin", "staff"]),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware(["admin", "staff"]),
  productController.deleteProduct
);
router.get("/:id", productController.getProductById);

export const productRoutes = router;
