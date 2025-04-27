import roles from "../config/roles.json" with { type: "json" };

class Permissions {
    constructor() {
      this.roles = roles.roles;
    }
  
  getPermissionsByRoleName(roleName) {
      const role = roles.roles.find((r) => r.name === roleName);
      if (!role) {
        console.error(`[RBAC] Role '${roleName}' not found in roles.json`);
        return [];
      }
      return role.permissions;
    }
  }

export default Permissions;