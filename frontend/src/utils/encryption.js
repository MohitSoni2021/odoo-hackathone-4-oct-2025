import CryptoJS from 'crypto-js';

// Use a fixed secret key for encryption/decryption
// In production, consider using environment variables or other secure methods
const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'expense-management-app-secret-key-2025';

/**
 * Encrypt data before storing in sessionStorage
 * @param {Object} data - Data to encrypt
 * @returns {string} - Encrypted string
 */
export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

/**
 * Decrypt data retrieved from sessionStorage
 * @param {string} encryptedData - Encrypted string
 * @returns {Object} - Decrypted data object
 */
export const decryptData = (encryptedData) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
