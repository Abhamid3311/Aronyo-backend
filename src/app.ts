import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./app/modules/auth/auth.route";
import { userRoutes } from "./app/modules/user/user.route";
import { productRoutes } from "./app/modules/products/product.route";

const app: Application = express();

//parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Application routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Aronyo Backend!");
});

export default app;
