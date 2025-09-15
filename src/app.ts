import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
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

// Explicit CORS headers (helps on some platforms where preflight may skip middleware)
const allowedOrigins = [
  "https://aronyo.vercel.app",
  "http://localhost:3000",
  "https://sandbox.sslcommerz.com",
];

app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin as string | undefined;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );

  if (req.method === "OPTIONS") {
    // Short-circuit preflight
    return res.sendStatus(204);
  }
  next();
});

const corsOptions: CorsOptions = {
  origin: [
    "https://aronyo.vercel.app",
    "http://localhost:3000",
    "https://sandbox.sslcommerz.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

app.use(cors(corsOptions));

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
