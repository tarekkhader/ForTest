const DEFAULT_ADMIN_USERNAME = "omargamal404";

export function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeName(s) {
  return String(s || "")
    .trim()
    .toLowerCase();
}

/** Usernames that count as admin via .env (primary + comma-separated extras). */
export function envAdminUsernamesSet() {
  const set = new Set();
  const primary = process.env.DASHBOARD_ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
  const n = normalizeName(primary);
  if (n) set.add(n);
  const list = process.env.DASHBOARD_ADMIN_USERNAMES || "";
  list.split(",").forEach((part) => {
    const x = normalizeName(part);
    if (x) set.add(x);
  });
  return set;
}

/**
 * Admin if: document role is "admin", OR username is listed in env admin list.
 * @param {object} u - plain user object (e.g. toJSON result) with username & optional role
 */
export function resolveUserRole(u) {
  if (!u) return "user";
  if (u.role === "admin") return "admin";
  const name = normalizeName(u.username);
  if (name && envAdminUsernamesSet().has(name)) return "admin";
  return "user";
}

export async function findUserByLoginUsername(UserModel, raw) {
  const q = String(raw || "").trim();
  if (!q) return null;
  return UserModel.findOne({
    username: { $regex: new RegExp(`^${escapeRegex(q)}$`, "i") },
  });
}
