// An application depends on what roles it will have.

const allRoles = {
  user: ["common", "user"],
  agent: ["common", "adminAndAgent", "agent"],
  admin: ["common", "adminAndAgent", "admin"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
