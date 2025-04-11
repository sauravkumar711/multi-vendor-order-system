import redisClient from "../config/redis.js";

export const cache = async (req, res, next) => {
  const vendorId = req.user.id; // Assuming vendorId is part of the authenticated user
  const cacheKey = `products:${vendorId}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    next();
  } catch (err) {
    console.error("Redis Cache Error:", err);
    next();
  }
};
