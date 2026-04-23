const roleMiddleware = (allowedRoles = []) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      return next();
    } catch (error) {
      console.error("Role Middleware Error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  };
};

module.exports = roleMiddleware;
