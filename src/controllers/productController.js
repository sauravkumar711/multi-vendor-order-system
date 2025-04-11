import mongoose from "mongoose"; // 👈 Import mongoose
import Product from "../models/Product.js";
import redisClient from "../config/redis.js";

export const createProduct = async (req, res) => {
  const vendorId = req.user.id;
  const cacheKey = `products:${vendorId}`;

  try {
    const product = await Product.create({ ...req.body, vendorId });

    // Invalidate cache
    await redisClient.del(cacheKey);

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyProducts = async (req, res) => {
  const vendorId = req.user.id;
  const cacheKey = `products:${vendorId}`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("📦 Returned from Redis cache");
      return res.json(JSON.parse(cached));
    }

    // Convert vendorId to ObjectId
    const products = await Product.find({
      vendorId: new mongoose.Types.ObjectId(vendorId),
    });

    await redisClient.set(cacheKey, JSON.stringify(products), { EX: 3600 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const vendorId = req.user.id;
  const cacheKey = `products:${vendorId}`;

  try {
    const product = await Product.findOneAndUpdate(
      { _id: id, vendorId },
      req.body,
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Invalidate cache
    await redisClient.del(cacheKey);

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const vendorId = req.user.id;
  const cacheKey = `products:${vendorId}`;

  try {
    const product = await Product.findOneAndDelete({ _id: id, vendorId });

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Invalidate cache
    await redisClient.del(cacheKey);

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
