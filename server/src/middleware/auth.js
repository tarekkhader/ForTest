import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-change-me";

export function signToken(userId, role = "user") {
  return jwt.sign({ sub: userId, role }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    req.userRole = payload.role || "user";
    next();
  } catch {
    return res.status(401).json({ message: "invalid or expired token" });
  }
}
