/**
 * Grant dashboard admin to an existing account by username.
 * Usage (from server folder): npm run admin:promote -- <username>
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDb } from "./config/db.js";
import { User } from "./models/User.js";
import { findUserByLoginUsername } from "./lib/authHelpers.js";

async function main() {
  const username = process.argv[2];
  if (!username?.trim()) {
    console.error("Usage: npm run admin:promote -- <username>");
    process.exit(1);
  }

  await connectDb(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce");
  const user = await findUserByLoginUsername(User, username);
  if (!user) {
    console.error("User not found:", username);
    await mongoose.disconnect();
    process.exit(1);
  }
  user.role = "admin";
  await user.save();
  console.log("OK —", user.username, "is now an admin (restart API if needed).");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
