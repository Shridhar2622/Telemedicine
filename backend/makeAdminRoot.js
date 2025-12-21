const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const makeAdmin = async () => {
  try {
    console.log('Connecting to DB...');
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

    user.role = 'Admin';
    await user.save();

    console.log(`User ${user.email} promoted to Admin successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Error in makeAdmin:', error);
    process.exit(1);
  }
};

makeAdmin();
