import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/auth';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + '/signup', userData);

  if (response.data) {
    // Backend returns { status, token, data: { user } }
    // We need to flatten it to { token, ...user }
    const { token, data } = response.data;
    const userWithToken = {
      token,
      ...data.user._doc || data.user, // Handle both mongoose document and plain object
      role: data.user.role,
      email: data.user.email,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
    };
    localStorage.setItem('user', JSON.stringify(userWithToken));
    return userWithToken;
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + '/login', userData);

  if (response.data) {
    // Backend returns { status, token, data: { user } }
    // We need to flatten it to { token, ...user }
    const { token, data } = response.data;
    const userWithToken = {
      token,
      ...data.user._doc || data.user, // Handle both mongoose document and plain object
      role: data.user.role,
      email: data.user.email,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
    };
    localStorage.setItem('user', JSON.stringify(userWithToken));
    return userWithToken;
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user
const getCurrentUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + '/me', config);

  return response.data;
};

// Update user profile
const updateUserProfile = async (userData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const response = await axios.patch(API_URL + '/updateMe', userData, config);

  if (response.data) {
    // Update localStorage with new user data
    const updatedUser = {
      ...user,
      ...response.data.data.user,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateUserProfile,
};

export default authService;
export { updateUserProfile };