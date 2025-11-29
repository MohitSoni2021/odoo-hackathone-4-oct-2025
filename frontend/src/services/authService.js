import axios from 'axios';
import { encryptData, decryptData } from '../utils/encryption';

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
    const encryptedUser = encryptData(userWithToken);
    sessionStorage.setItem('user', encryptedUser);
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
    const encryptedUser = encryptData(userWithToken);
    sessionStorage.setItem('user', encryptedUser);
    return userWithToken;
  }

  return response.data;
};

// Logout user
const logout = () => {
  sessionStorage.removeItem('user');
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
  const encryptedUser = sessionStorage.getItem('user');
  const user = encryptedUser ? decryptData(encryptedUser) : null;
  
  if (!user) {
    throw new Error('User not found in sessionStorage');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const response = await axios.patch(API_URL + '/updateMe', userData, config);

  if (response.data) {
    // Update sessionStorage with new user data
    const updatedUser = {
      ...user,
      ...response.data.data.user,
    };
    const encryptedUpdatedUser = encryptData(updatedUser);
    sessionStorage.setItem('user', encryptedUpdatedUser);
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