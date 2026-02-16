require('dotenv').config(); // simple, works locally and on Render

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { getJwtSecret } = require('./utils/env');
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const feeRoutes = require('./routes/fee.routes');

const app = express();
const PORT = process.env.PORT || 5000;
const jwtSecret = getJwtSecret();
if (!jwtSecret) {
  console.error('Missing JWT secret. Set JWT_SECRET or JWT_SECRET_KEY in Render environment variables.');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fees', feeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server only after DB connects
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
