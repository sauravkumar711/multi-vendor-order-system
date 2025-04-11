import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// === ADMIN CONTROLLERS ===

export const getRevenuePerVendor = async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const revenue = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $unwind: "$subOrders" },
    {
      $group: {
        _id: "$subOrders.vendorId",
        totalRevenue: { $sum: "$subOrders.total" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "vendor",
      },
    },
    {
      $project: {
        vendorId: "$_id",
        totalRevenue: 1,
        vendorEmail: { $arrayElemAt: ["$vendor.email", 0] },
      },
    },
  ]);

  res.json(revenue);
};

export const getTopProducts = async (req, res) => {
  const topProducts = await Order.aggregate([
    { $unwind: "$subOrders" },
    { $unwind: "$subOrders.items" },
    {
      $group: {
        _id: "$subOrders.items.productId",
        totalSold: { $sum: "$subOrders.items.quantity" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $project: {
        productId: "$_id",
        totalSold: 1,
        name: { $arrayElemAt: ["$product.name", 0] },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  res.json(topProducts);
};

export const getAvgOrderValue = async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const avg = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: null,
        avgValue: { $avg: "$total" },
      },
    },
  ]);

  res.json({ averageOrderValue: avg[0]?.avgValue || 0 });
};

// === VENDOR CONTROLLERS ===

export const getDailySales = async (req, res) => {
  const vendorId = new mongoose.Types.ObjectId(req.user.id);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const sales = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $unwind: "$subOrders" },
    { $match: { "subOrders.vendorId": vendorId } },
    {
      $group: {
        _id: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$subOrders.total" },
      },
    },
    { $sort: { "_id.day": 1 } },
  ]);

  res.json(sales);
};

export const getLowStockProducts = async (req, res) => {
  const vendorId = req.user.id;

  const lowStock = await Product.find({
    vendorId,
    stock: { $lt: 5 },
  });

  res.json(lowStock);
};
