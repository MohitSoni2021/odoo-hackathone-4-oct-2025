const express = require('express');
const User = require('../models/userModel');
const Company = require('../models/companyModel');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Helper function to create JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Helper function to get currency by country
const getCurrencyByCountry = (country) => {
  const currencyMap = {
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'European Union': 'EUR',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'Japan': 'JPY',
    'India': 'INR',
    'Germany': 'EUR',
    'France': 'EUR',
    'Italy': 'EUR',
    'Spain': 'EUR',
    'China': 'CNY',
    'Brazil': 'BRL',
    'Mexico': 'MXN',
    'South Korea': 'KRW',
    'Singapore': 'SGD',
    'Switzerland': 'CHF',
    'Sweden': 'SEK',
    'Norway': 'NOK',
    'Denmark': 'DKK',
  };
  
  return currencyMap[country] || 'USD';
};

/**
 * @route   POST /api/admin/create-admin
 * @desc    Create a new admin user with company
 * @access  Public (for initial setup only - should be secured in production)
 */

router.post('/create-admin', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      country, 
      companyName 
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !country || !companyName) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required fields: firstName, lastName, email, password, country, companyName',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists with this email',
      });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      return res.status(400).json({
        status: 'fail',
        message: 'Company already exists with this name',
      });
    }

    // Create admin user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      country,
      role: 'admin',
      isFirstLogin: false, // Set to false for admin created via API
    });

    // Get currency based on country
    const currency = getCurrencyByCountry(country);

    // Create company
    const newCompany = await Company.create({
      name: companyName,
      country,
      currency,
      admin: newUser._id,
    });

    // Update user with company
    newUser.company = newCompany._id;
    await newUser.save({ validateBeforeSave: false });

    // Generate token
    const token = signToken(newUser._id);

    // Remove password from output
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      message: 'Admin user and company created successfully',
      token,
      data: {
        user: newUser,
        company: newCompany,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/admin/create-test-data
 * @desc    Create test data (admin, managers, employees, expenses)
 * @access  Public (for development only)
 */
router.post('/create-test-data', async (req, res) => {
  try {
    const { companyName = 'Test Company', country = 'United States' } = req.body;

    // Create admin
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: 'admin123456',
      country,
      role: 'admin',
      isFirstLogin: false,
    });

    // Create company
    const company = await Company.create({
      name: companyName,
      country,
      currency: getCurrencyByCountry(country),
      admin: admin._id,
    });

    admin.company = company._id;
    await admin.save({ validateBeforeSave: false });

    // Create managers
    const manager1 = await User.create({
      firstName: 'John',
      lastName: 'Manager',
      email: 'manager1@test.com',
      password: 'manager123456',
      country,
      role: 'manager',
      company: company._id,
      isFirstLogin: false,
    });

    const manager2 = await User.create({
      firstName: 'Jane',
      lastName: 'Manager',
      email: 'manager2@test.com',
      password: 'manager123456',
      country,
      role: 'manager',
      company: company._id,
      isFirstLogin: false,
    });

    // Create employees
    const employee1 = await User.create({
      firstName: 'Alice',
      lastName: 'Employee',
      email: 'employee1@test.com',
      password: 'employee123456',
      country,
      role: 'employee',
      company: company._id,
      manager: manager1._id,
      isFirstLogin: false,
    });

    const employee2 = await User.create({
      firstName: 'Bob',
      lastName: 'Employee',
      email: 'employee2@test.com',
      password: 'employee123456',
      country,
      role: 'employee',
      company: company._id,
      manager: manager1._id,
      isFirstLogin: false,
    });

    const employee3 = await User.create({
      firstName: 'Charlie',
      lastName: 'Employee',
      email: 'employee3@test.com',
      password: 'employee123456',
      country,
      role: 'employee',
      company: company._id,
      manager: manager2._id,
      isFirstLogin: false,
    });

    res.status(201).json({
      status: 'success',
      message: 'Test data created successfully',
      data: {
        company,
        users: {
          admin,
          managers: [manager1, manager2],
          employees: [employee1, employee2, employee3],
        },
        credentials: {
          admin: { email: 'admin@test.com', password: 'admin123456' },
          manager1: { email: 'manager1@test.com', password: 'manager123456' },
          manager2: { email: 'manager2@test.com', password: 'manager123456' },
          employee1: { email: 'employee1@test.com', password: 'employee123456' },
          employee2: { email: 'employee2@test.com', password: 'employee123456' },
          employee3: { email: 'employee3@test.com', password: 'employee123456' },
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
});

module.exports = router;