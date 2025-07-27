import { Router } from "express";
import { productController } from "./product.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create-product",
  authMiddleware(["admin", "staff"]),
  productController.createProduct
);

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

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

export const productRoutes = router;
