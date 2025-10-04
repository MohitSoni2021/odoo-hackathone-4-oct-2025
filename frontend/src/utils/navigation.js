/**
 * Get the default route for a user based on their role
 * @param {string} role - User role (admin, manager, employee)
 * @returns {string} - Default route path
 */
export const getDefaultRouteForRole = (role) => {
  switch (role) {
    case 'admin':
      return '/dashboard';
    case 'manager':
      return '/dashboard/expenses';
    case 'employee':
      return '/dashboard/expenses';
    default:
      return '/dashboard';
  }
};

/**
 * Check if user has access to a specific route
 * @param {string} role - User role
 * @param {string} path - Route path
 * @returns {boolean} - Whether user has access
 */
export const hasAccessToRoute = (role, path) => {
  const adminOnlyRoutes = ['/dashboard/users'];
  
  if (adminOnlyRoutes.some(route => path.startsWith(route))) {
    return role === 'admin';
  }
  
  return true;
};