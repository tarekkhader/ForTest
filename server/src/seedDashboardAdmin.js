import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import { findUserByLoginUsername } from "./lib/authHelpers.js";

const DEFAULT_NAME = "omargamal404";

export async function seedDashboardAdminIfEnabled() {
  if (process.env.SEED_DASHBOARD_ADMIN !== "true") return;

  try {
    const username = (process.env.DASHBOARD_ADMIN_USERNAME || DEFAULT_NAME).trim();
    const password = process.env.DASHBOARD_ADMIN_PASSWORD || "2112";
    const email = (
      process.env.DASHBOARD_ADMIN_EMAIL || `${username}@dashboard.local`
    ).toLowerCase();

    const existing = await findUserByLoginUsername(User, username);
    const passwordHash = await bcrypt.hash(password, 10);

    if (existing) {
      if (process.env.UPDATE_EXISTING_ADMIN_PASSWORD === "true") {
        existing.passwordHash = passwordHash;
        existing.role = "admin";
        await existing.save();
        console.log("Updated password for dashboard admin:", username);
      } else {
        if (existing.role !== "admin") {
          existing.role = "admin";
          await existing.save();
          console.log("Set role=admin for:", username);
        }
        console.log(
          "Dashboard admin user already exists:",
          username,
          "(set UPDATE_EXISTING_ADMIN_PASSWORD=true to reset password, or run npm run admin:reset)",
        );
      }
      return;
    }

    await User.create({
      username,
      email,
      fullName: process.env.DASHBOARD_ADMIN_FULLNAME || "Dashboard Admin",
      phone: "",
      address: "",
      passwordHash,
      role: "admin",
    });
    console.log("Created dashboard admin user:", username);
  } catch (err) {
    console.error("seedDashboardAdminIfEnabled:", err.message);
  }
}
