const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/userModel');

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingSuperAdmin = await User.findOne({ email: '9mohit@gmail.com' });
    if (existingSuperAdmin) {
      console.log('Superadmin already exists');
      process.exit(0);
    }

    await User.create({
      firstName: 'Mohit',
      lastName: 'Super',
      email: '9mohit@gmail.com',
      password: '123456789',
      role: 'superadmin',
      isFirstLogin: false
    });

    console.log('Superadmin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating superadmin:', error);
    process.exit(1);
  }
};

seedSuperAdmin();
