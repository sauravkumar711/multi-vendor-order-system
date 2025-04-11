import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { secret, expiresIn } from "../config/jwt.js";

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn });
};

export const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user);
  res.json({ token });
};
