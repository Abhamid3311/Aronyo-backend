"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const category_controller_1 = require("./category.controller");
const router = express_1.default.Router();
router.get("/", category_controller_1.categoryController.getAllCategories);
router.post("/create-category", (0, auth_middleware_1.authMiddleware)(["admin"]), category_controller_1.categoryController.createCategory);
router.get("/admin/all-categories", (0, auth_middleware_1.authMiddleware)(["admin"]), category_controller_1.categoryController.getCategoriesAdmin);
router.get("/:id", (0, auth_middleware_1.authMiddleware)(["admin"]), category_controller_1.categoryController.getSingleCategory);
router.put("/:id", (0, auth_middleware_1.authMiddleware)(["admin"]), category_controller_1.categoryController.updateCategory);
router.delete("/:id", (0, auth_middleware_1.authMiddleware)(["admin"]), category_controller_1.categoryController.deleteCategory);
exports.CategoryRoutes = router;
