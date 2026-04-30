import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "dev-secret-please-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "12h";

// In-memory user store. Replace with a real DB (Postgres/Mongo) when wiring
// production. The shape (id, email, name, role, passwordHash) is what the
// frontend depends on, so swapping the storage layer is a localized change.
const USERS = [
  {
    id: "u-student-1",
    email: "student@gmail.com",
    name: "Yash Modi",
    role: "student",
    passwordHash: bcrypt.hashSync("1234", 10),
  },
  {
    id: "u-trainer-1",
    email: "trainer@gmail.com",
    name: "Praful Bhoyar",
    role: "trainer",
    passwordHash: bcrypt.hashSync("1234", 10),
  },
  {
    id: "u-admin-1",
    email: "admin@gmail.com",
    name: "Anand Rao",
    role: "admin",
    passwordHash: bcrypt.hashSync("1234", 10),
  },
  {
    id: "u-director-1",
    email: "director@gmail.com",
    name: "Meera Krishnan",
    role: "director",
    passwordHash: bcrypt.hashSync("1234", 10),
  },
];

const sanitize = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const findUserById = (id) => USERS.find((u) => u.id === id);
const findUserByEmail = (email) =>
  USERS.find(
    (u) => u.email.toLowerCase() === String(email || "").toLowerCase()
  );

// Express middleware — attach req.user when a valid Bearer token is present.
// Routes that *require* auth should additionally check req.user themselves.
export const authMiddleware = (req, _res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = findUserById(payload.id);
      if (user) req.user = sanitize(user);
    } catch {
      // Invalid token — leave req.user unset, downstream routes can decide.
    }
  }
  next();
};

export const registerAuthRoutes = (app) => {
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = findUserByEmail(email);
      // Always run bcrypt.compare so the response time doesn't leak which
      // emails exist. Compare against a dummy hash when the user is missing.
      const hash =
        user?.passwordHash ||
        "$2a$10$CwTycUXWue0Thq9StjUM0u.J6.g3WJ5.0sTkBn/1Z4RmS3GFf.tHO";
      const ok = await bcrypt.compare(password, hash);

      if (!user || !ok) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = signToken(user);
      console.log(`[auth] login -> ${user.email} (${user.role})`);
      res.json({ token, user: sanitize(user) });
    } catch (err) {
      console.error("[auth/login] error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Validate a token and echo the current user. Useful for restoring sessions
  // on page reload before sending the user into a protected route.
  app.get("/api/auth/me", (req, res) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "No token provided" });
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = findUserById(payload.id);
      if (!user) return res.status(401).json({ error: "User not found" });
      res.json({ user: sanitize(user) });
    } catch {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  });
};
