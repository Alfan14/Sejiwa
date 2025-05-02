import fs from 'fs';
import path from 'path';

// Attempting to read roles.json file
const rolesFilePath = path.resolve('../config/roles.json');

let rolesData = null;

try {
  const rawRoles = fs.readFileSync(rolesFilePath, 'utf-8');
  rolesData = JSON.parse(rawRoles);
} catch (error) {
  console.error(" Error reading roles.json:", error.message);
  process.exit(1);
}

class Role {
  constructor() {
    this.roles = rolesData.roles;
  }

  getRoleByName(name) {
    return this.roles.find((role) => role.name === name) || null;
  }
}

const roleInstance = new Role();
export default roleInstance;
