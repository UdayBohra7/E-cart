const allRoles = {
  USER: [],
  ADMIN: [
    'getUsers',
    'manageUsers',
    'getProducts',
    'manageProducts',
    'getCategories',
    'manageCategories',
  ],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
