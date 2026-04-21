/**
 * One-shot: create or reset the primary dashboard admin (password + role admin).
 * Run: npm run admin:reset
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "./config/db.js";
import { User } from "./models/User.js";
import { findUserByLoginUsername } from "./lib/authHelpers.js";

const DEFAULT_USER = "omargamal404";

async function main() {
  const username = (process.env.DASHBOARD_ADMIN_USERNAME || DEFAULT_USER).trim();
  const password = process.env.DASHBOARD_ADMIN_PASSWORD || "2112";
  const email = (
    process.env.DASHBOARD_ADMIN_EMAIL || `${username}@dashboard.local`
  ).toLowerCase();

  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce";
  await connectDb(uri);

  const passwordHash = await bcrypt.hash(password, 10);
  let user = await findUserByLoginUsername(User, username);

  if (user) {
    user.passwordHash = passwordHash;
    user.role = "admin";
    await user.save();
    console.log("Updated password and role for:", username);
  } else {
    await User.create({
      username,
      email,
      fullName: process.env.DASHBOARD_ADMIN_FULLNAME || "Dashboard Admin",
      phone: "",
      address: "",
      passwordHash,
      role: "admin",
    });
    console.log("Created admin user:", username);
  }

  console.log("You can sign in with username:", username, "password:", password);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
