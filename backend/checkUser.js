const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const checkUser = async () => {
  try {
    if (!process.env.MONGODB_URL) {
        console.error('MONGODB_URL is missing');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB Connected');

    const email = 'vansh14raturi@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found: ' + email);
      process.exit(1);
    }

    console.log(`User found: ${user.email}`);
    console.log(`Role: ${user.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUser();
