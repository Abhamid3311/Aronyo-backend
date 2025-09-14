import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./app/modules/auth/auth.route";
import { userRoutes } from "./app/modules/user/user.route";
import { productRoutes } from "./app/modules/products/product.route";
import { CategoryRoutes } from "./app/modules/category/category.route";
import { cartRoutes } from "./app/modules/cart/cart.route";
import { reviewRoutes } from "./app/modules/reviews/review.route";
import { orderRoutes } from "./app/modules/orders/order.route";
import { WishlistRoutes } from "./app/modules/wishlist/wishlist.route";
import { blogRoutes } from "./app/modules/blog/blog.route";

const app: Application = express();

/* const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://sandbox.sslcommerz.com",
    "https://aronyo.vercel.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); */

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Application routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/category", CategoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/wishlist", WishlistRoutes);
app.use("/api/v1/blog", blogRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Aronyo Backend!");
});

export default app;
