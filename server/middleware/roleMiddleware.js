const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // ✅ Check auth exists
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // ✅ Normalize to array
      if (!Array.isArray(allowedRoles)) {
        allowedRoles = [allowedRoles];
      }

      // ✅ Check role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      next();

    } catch (error) {
      console.error("Role Middleware Error:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
};

module.exports = roleMiddleware;