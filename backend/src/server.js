const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const feeRoutes = require('./routes/fee.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log('API endpoints:');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/dashboard/stats');
  console.log('  GET  /api/students');
  console.log('  POST /api/students');
  console.log('  GET  /api/students/:id');
  console.log('  PATCH /api/students/:id');
  console.log('  DELETE /api/students/:id');
  console.log('  POST /api/fees/pay');
});
