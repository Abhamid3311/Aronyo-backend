import express, { Application, Request, Response } from "express";
import cors from "cors";
import { studentRoutes } from "./app/modules/student/student.route";
import cookieParser from "cookie-parser";
import { authRoutes } from "./app/modules/auth/auth.route";
import { userRoutes } from "./app/modules/user/user.route";

const app: Application = express();

//parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Application routes
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Aronyo Backend!");
});

export default app;
