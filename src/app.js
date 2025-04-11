import express from "express";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { setupSwaggerDocs } from "./docs/swagger.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("API is running..."));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); 
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
setupSwaggerDocs(app);

export default app;
