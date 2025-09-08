import { Router } from "express";
import { blogController } from "./blog.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", blogController.getBlogs);

router.post(
  "/create-blog",
  authMiddleware(["admin", "staff"]),
  blogController.createBlog
);

router.put(
  "/update-blog/:id",
  authMiddleware(["admin", "staff"]),
  blogController.updateBlog
);

router.delete(
  "/:id",
  authMiddleware(["admin", "staff"]),
  blogController.deleteBlog
);

router.get("/admin/:id", blogController.getBlogById);

export const blogRoutes = router;
