require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGO_URI:', process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected successfully!');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);

    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
  process.exit(0);
};

testConnection();