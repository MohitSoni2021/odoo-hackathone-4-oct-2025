const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Company = require('../models/companyModel');

// Helper function to create JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Helper function to send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// Register a new user
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, country, companyName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists with this email',
      });
    }

    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      country,
      role: 'admin', // First user is always admin
    });

    // Create company
    const newCompany = await Company.create({
      name: companyName,
      country,
      currency: getCurrencyByCountry(country),
      admin: newUser._id,
    });

    // Update user with company
    newUser.company = newCompany._id;
    await newUser.save({ validateBeforeSave: false });

    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Protect routes - middleware to check if user is logged in
exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    console.log('Auth Success:', {
      userId: currentUser._id,
      email: currentUser.email,
      role: currentUser.role,
      path: req.path,
      method: req.method,
    });

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Not authorized',
    });
  }
};

// Restrict to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('Role Check:', {
      requiredRoles: roles,
      userRole: req.user?.role,
      userId: req.user?._id,
      path: req.path,
    });
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('company');
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
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
    // Add more countries as needed
  };
  
  return currencyMap[country] || 'USD';
};