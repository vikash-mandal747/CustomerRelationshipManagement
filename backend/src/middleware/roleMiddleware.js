// src/middleware/roleMiddleware.js

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(401).json({ message: 'User role missing' });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied: insufficient role' });
      }

      next();
    } catch (error) {
      console.error('Role Error:', error.message);
      res.status(500).json({ message: 'Role verification failed' });
    }
  };
};

module.exports = allowRoles;
