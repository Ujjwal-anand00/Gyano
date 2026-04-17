const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Check header exists
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // ✅ Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify token using ENV
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user to request
    req.user = decoded;

    next();

  } catch (error) {
    console.error("Auth Error:", error.message);

    // ✅ Handle expired token separately
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;