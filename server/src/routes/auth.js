import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { authMiddleware, signToken } from "../middleware/auth.js";
import {
  findUserByLoginUsername,
  normalizeName,
  resolveUserRole,
  envAdminUsernamesSet,
} from "../lib/authHelpers.js";

export const authRouter = Router();

function userResponse(userDoc) {
  const u = userDoc.toJSON();
  const role = resolveUserRole(u);
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    fullName: u.fullName,
    phone: u.phone,
    address: u.address,
    role,
    createdAt: u.createdAt,
  };
}

authRouter.post("/register", async (req, res) => {
  try {
    const { username, password, email, fullName, phone, address } = req.body;
    if (!username || !password || !email || !fullName) {
      return res.status(400).json({
        message: "username, password, email, and full name are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" });
    }
    const emailNorm = String(email).trim().toLowerCase();
    const [existingUser, existingEmail] = await Promise.all([
      findUserByLoginUsername(User, username),
      User.findOne({ email: emailNorm }),
    ]);
    if (existingUser) {
      return res.status(409).json({ message: "username already taken" });
    }
    if (existingEmail) {
      return res.status(409).json({ message: "email already registered" });
    }
    if (envAdminUsernamesSet().has(normalizeName(username))) {
      return res.status(403).json({ message: "this username is reserved" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      email: emailNorm,
      fullName: String(fullName).trim(),
      phone: phone != null ? String(phone).trim() : "",
      address: address != null ? String(address).trim() : "",
      passwordHash,
      role: "user",
    });
    const u = userResponse(user);
    const token = signToken(user._id.toString(), u.role);
    return res.status(201).json({
      message: "registered",
      token,
      user: u,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "username and password required" });
    }
    const user = await findUserByLoginUsername(User, username);
    if (!user) {
      return res.status(401).json({ message: "invalid username or password" });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "invalid username or password" });
    }
    const u = userResponse(user);
    const token = signToken(user._id.toString(), u.role);
    return res.json({
      message: "ok",
      token,
      user: u,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});

authRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    return res.json({ user: userResponse(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});
