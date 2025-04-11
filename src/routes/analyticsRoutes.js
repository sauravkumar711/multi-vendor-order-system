import express from "express";
import {
  getRevenuePerVendor,
  getTopProducts,
  getAvgOrderValue,
  getDailySales,
  getLowStockProducts,
} from "../controllers/analyticsController.js";

import { auth, authorize } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Admin and Vendor insights
 */

/**
 * @swagger
 * /api/analytics/admin/revenue:
 *   get:
 *     tags: [Analytics]
 *     summary: Get revenue per vendor (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue data
 */
router.get("/admin/revenue", auth, authorize("admin"), getRevenuePerVendor);

/**
 * @swagger
 * /api/analytics/admin/top-products:
 *   get:
 *     tags: [Analytics]
 *     summary: Get top 5 products by sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top-selling products
 */
router.get("/admin/top-products", auth, authorize("admin"), getTopProducts);

/**
 * @swagger
 * /api/analytics/admin/avg-order-value:
 *   get:
 *     tags: [Analytics]
 *     summary: Get average order value
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Average value of orders
 */
router.get(
  "/admin/avg-order-value",
  auth,
  authorize("admin"),
  getAvgOrderValue
);

/**
 * @swagger
 * /api/analytics/vendor/daily-sales:
 *   get:
 *     tags: [Analytics]
 *     summary: Get daily sales stats for vendor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales breakdown by day
 */
router.get("/vendor/daily-sales", auth, authorize("vendor"), getDailySales);

/**
 * @swagger
 * /api/analytics/vendor/low-stock:
 *   get:
 *     tags: [Analytics]
 *     summary: Get low-stock products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products with low inventory
 */
router.get("/vendor/low-stock", auth, authorize("vendor"), getLowStockProducts);

export default router;
