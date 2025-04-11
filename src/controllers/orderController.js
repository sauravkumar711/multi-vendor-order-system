import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customerId = req.user.id;
    const items = req.body.items; // [{ productId, quantity }]

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).session(
      session
    );

    // Validate all products exist
    if (products.length !== items.length) {
      throw new Error("Some products do not exist");
    }

    const productMap = new Map();
    products.forEach((p) => productMap.set(p._id.toString(), p));

    const vendorMap = new Map();

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) throw new Error("Product not found");
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save({ session });

      const itemTotal = product.price * item.quantity;

      if (!vendorMap.has(product.vendorId.toString())) {
        vendorMap.set(product.vendorId.toString(), {
          vendorId: product.vendorId,
          items: [],
          total: 0,
        });
      }

      vendorMap.get(product.vendorId.toString()).items.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      vendorMap.get(product.vendorId.toString()).total += itemTotal;
    }

    // Prepare sub-orders
    const subOrders = [...vendorMap.values()];
    const total = subOrders.reduce((sum, o) => sum + o.total, 0);

    const order = await Order.create(
      [
        {
          customerId,
          subOrders,
          total,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
};
