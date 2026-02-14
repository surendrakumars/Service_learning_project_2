require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@cambridgekids.com' });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log('🔐 Login credentials: admin@cambridgekids.com / admin123');
      await mongoose.connection.close();
      return;
    }

    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    console.log('👤 Creating admin user...');
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@cambridgekids.com',
      password_hash: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('🔐 Login credentials:');
    console.log('   Email: admin@cambridgekids.com');
    console.log('   Password: admin123');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();