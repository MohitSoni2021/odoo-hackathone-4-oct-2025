const User = require('../models/userModel');
const Company = require('../models/companyModel');
const Expense = require('../models/expenseModel');
const Notification = require('../models/notificationModel');

// Get all users in the company (Admin/Manager)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search, isActive } = req.query;
    
    // Build query
    const query = { company: req.user.company };
    
    if (role) {
      query.role = role;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    const users = await User.find(query)
      .populate('manager', 'firstName lastName email')
      .sort('-createdAt');
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('company')
      .populate('manager', 'firstName lastName email');
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID',
      });
    }
    
    // Check if user belongs to same company
    if (user.company._id.toString() !== req.user.company.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this user',
      });
    }
    
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

// Create new user (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, manager, country } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists with this email',
      });
    }
    
    // Validate manager if role is employee
    if (role === 'employee' && !manager) {
      return res.status(400).json({
        status: 'fail',
        message: 'Employee must have a manager',
      });
    }
    
    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      manager: role === 'employee' ? manager : undefined,
      country: country || req.user.country,
      company: req.user.company,
    });
    
    // Create notification for new user
    await Notification.create({
      recipient: newUser._id,
      sender: req.user._id,
      type: 'user_added',
      title: 'Welcome to the team!',
      message: `You have been added to ${req.user.company.name} as ${role}`,
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, role, manager, isActive, country } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID',
      });
    }
    
    // Check if user belongs to same company
    if (user.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to update this user',
      });
    }
    
    // Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString() && role && role !== user.role) {
      return res.status(400).json({
        status: 'fail',
        message: 'You cannot change your own role',
      });
    }
    
    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (country) user.country = country;
    if (isActive !== undefined) user.isActive = isActive;
    
    // Handle role change
    if (role && role !== user.role) {
      user.role = role;
      
      // Create notification for role change
      await Notification.create({
        recipient: user._id,
        sender: req.user._id,
        type: 'role_changed',
        title: 'Your role has been updated',
        message: `Your role has been changed to ${role}`,
      });
    }
    
    // Handle manager assignment
    if (role === 'employee' && manager) {
      user.manager = manager;
    } else if (role !== 'employee') {
      user.manager = undefined;
    }
    
    await user.save();
    
    const updatedUser = await User.findById(user._id)
      .populate('manager', 'firstName lastName email');
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID',
      });
    }
    
    // Check if user belongs to same company
    if (user.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this user',
      });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        status: 'fail',
        message: 'You cannot delete yourself',
      });
    }
    
    // Check if user is a company admin
    const company = await Company.findById(req.user.company);
    if (company.admin.toString() === user._id.toString()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot delete company admin',
      });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get user statistics (Admin/Manager)
exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $match: { company: req.user.company },
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);
    
    const activeUsers = await User.countDocuments({
      company: req.user.company,
      isActive: true,
    });
    
    const inactiveUsers = await User.countDocuments({
      company: req.user.company,
      isActive: false,
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        roleStats: stats,
        activeUsers,
        inactiveUsers,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get employees under a manager
exports.getMyEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      manager: req.user._id,
      company: req.user.company,
    }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: employees.length,
      data: {
        employees,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get manager's team (manager + employees)
exports.getMyTeam = async (req, res) => {
  try {
    console.log('Get My Team Request:', {
      userId: req.user._id,
      userRole: req.user.role,
      companyId: req.user.company,
    });
    
    const employees = await User.find({
      manager: req.user._id,
      company: req.user.company,
    }).sort('-createdAt');

    // Get total expenses for each employee
    const teamWithExpenses = await Promise.all(
      employees.map(async (employee) => {
        const expenseStats = await Expense.aggregate([
          {
            $match: {
              submittedBy: employee._id,
              company: req.user.company,
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: '$amount' },
              count: { $sum: 1 },
            },
          },
        ]);

        return {
          ...employee.toObject(),
          totalExpenses: expenseStats[0]?.count || 0,
          totalExpenseAmount: expenseStats[0]?.totalAmount || 0,
        };
      })
    );

    // Add manager's own expenses
    const managerExpenseStats = await Expense.aggregate([
      {
        $match: {
          submittedBy: req.user._id,
          company: req.user.company,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const managerWithExpenses = {
      ...req.user.toObject(),
      totalExpenses: managerExpenseStats[0]?.count || 0,
      totalExpenseAmount: managerExpenseStats[0]?.totalAmount || 0,
    };

    const team = [managerWithExpenses, ...teamWithExpenses];

    res.status(200).json({
      status: 'success',
      results: team.length,
      data: {
        team,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update own profile
exports.updateMe = async (req, res) => {
  try {
    const { firstName, lastName, country, preferredCurrency } = req.body;
    
    // Don't allow password update here
    if (req.body.password) {
      return res.status(400).json({
        status: 'fail',
        message: 'This route is not for password updates',
      });
    }
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (country) updateData.country = country;
    if (preferredCurrency) updateData.preferredCurrency = preferredCurrency.toUpperCase();
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};