import Permissions from '../models/permissions.mjs';

// Check if the user has the required permission for a route
 const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ error: "Access denied: No role assigned" });
      }
    
      const userRole = req.user.role;
      const permissionsInstance = new Permissions(); 
      const userPermissions = permissionsInstance.getPermissionsByRoleName(userRole);
      
      if (!userPermissions) {
        console.error("[RBAC] Role not found in permissions:", userRole);
        return res.status(403).json({ error: "Access denied: Role not recognized" });
      }

      if (userPermissions.includes(permission)) {
        return next();
      } else {
        return res.status(403).json({ error: 'Access denied : Permission not found' });
      }
   } catch (error) {
    console.error("RBAC Middleware Error:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message  });
  }
  };
};

const checkRole = (role) => {
  return async (req, res, next) => {
    const userRole = req.user?.role || 'anonymous';

    if (userRole === role) {
      return next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
};

export default {checkPermission, checkRole};
