gitconst mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
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
