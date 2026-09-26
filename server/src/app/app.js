import express from "express";
import authRoutes from "../routes/auth.routes.js";
import productsRoutes from "../routes/products.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);

export default app;
