const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/userModel');

dotenv.config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: '9mohit@gmail.com' });
    if (user) {
      console.log('User found:', user.email, 'Role:', user.role);
    } else {
      console.log('User NOT found');
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkUser();
