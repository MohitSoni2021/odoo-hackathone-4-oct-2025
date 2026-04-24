const Company = require('../models/companyModel');
const User = require('../models/userModel');

exports.getFullHierarchy = async (req, res) => {
  try {
    const companies = await Company.find().lean();
    
    const hierarchy = await Promise.all(companies.map(async (company) => {
      const users = await User.find({ company: company._id }).select('firstName lastName email role manager').lean();
      
      return {
        ...company,
        admins: users.filter(u => u.role === 'admin'),
        managers: users.filter(u => u.role === 'manager'),
        employees: users.filter(u => u.role === 'employee')
      };
    }));

    res.status(200).json({
      status: 'success',
      data: hierarchy
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide both email and new password'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: `Password updated successfully for ${email}`
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
