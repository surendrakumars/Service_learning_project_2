require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedUsers = async () => {
  console.log('🚀 Starting database seeding...');

  try {
    console.log('📡 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cambridge-kids');
    console.log('✅ Database connected');

    console.log('🧹 Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Existing users cleared');

    console.log('🔐 Generating password hash...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    console.log('✅ Password hashed');

    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@cambridgekids.com',
      password_hash: hashedPassword,
      role: 'admin',
    });
    console.log('✅ Admin user created in database');

    console.log(`🎉 SUCCESS! Admin user created:`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log('');
    console.log('🔐 LOGIN CREDENTIALS:');
    console.log('   Email: admin@cambridgekids.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('✅ Database seeding completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding users: ${error.message}`);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

seedUsers();
