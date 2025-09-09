"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = require("./app/modules/auth/auth.route");
const user_route_1 = require("./app/modules/user/user.route");
const product_route_1 = require("./app/modules/products/product.route");
const category_route_1 = require("./app/modules/category/category.route");
const cart_route_1 = require("./app/modules/cart/cart.route");
const review_route_1 = require("./app/modules/reviews/review.route");
const order_route_1 = require("./app/modules/orders/order.route");
const wishlist_route_1 = require("./app/modules/wishlist/wishlist.route");
const blog_route_1 = require("./app/modules/blog/blog.route");
const app = (0, express_1.default)();
//parser
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
//Application routes
app.use("/api/v1/auth", auth_route_1.authRoutes);
app.use("/api/v1/users", user_route_1.userRoutes);
app.use("/api/v1/products", product_route_1.productRoutes);
app.use("/api/v1/category", category_route_1.CategoryRoutes);
app.use("/api/v1/cart", cart_route_1.cartRoutes);
app.use("/api/v1/review", review_route_1.reviewRoutes);
app.use("/api/v1/orders", order_route_1.orderRoutes);
app.use("/api/v1/wishlist", wishlist_route_1.WishlistRoutes);
app.use("/api/v1/blog", blog_route_1.blogRoutes);
app.get("/", (req, res) => {
    res.send("Hello World from Aronyo Backend!");
});
exports.default = app;
