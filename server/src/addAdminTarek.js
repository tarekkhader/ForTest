/**
 * One-shot: ensure tarek@gmail.com exists as admin (password 1991).
 * Login username is usually "tarek" (see console output).
 * Run: npm run admin:add-tarek
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "./config/db.js";
import { User } from "./models/User.js";

const EMAIL = "tarek@gmail.com";
const PASSWORD = "1991";
const PREFERRED_USERNAME = "tarek";

async function main() {
  await connectDb(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce");

  const emailNorm = EMAIL.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  let user = await User.findOne({ email: emailNorm });
  if (user) {
    user.passwordHash = passwordHash;
    user.role = "admin";
    await user.save();
    console.log("Updated existing user — admin. Sign in with username:", user.username);
  } else {
    let username = PREFERRED_USERNAME;
    const taken = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });
    if (taken) {
      username = "tarek_admin";
    }
    await User.create({
      username,
      email: emailNorm,
      fullName: "Tarek",
      phone: "",
      address: "",
      passwordHash,
      role: "admin",
    });
    console.log("Created admin — sign in with username:", username, "password:", PASSWORD);
  }

  console.log("Email on file:", emailNorm);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
