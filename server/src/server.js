require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const studentsRoutes = require('./routes/student.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const feesRoutes = require('./routes/fee.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cambridge Kids API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fees', feesRoutes);

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
const startServer = async () => {
  const dbOk = await testConnection();
  if (!dbOk) {
    console.error('Cannot start server: database connection failed.');
    console.error('Make sure MongoDB is running and MONGO_URI is set in .env');
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log('  POST /api/auth/login');
    console.log('  GET  /api/dashboard/stats');
    console.log('  GET  /api/students');
    console.log('  POST /api/students');
    console.log('  GET  /api/students/:id');
    console.log('  PATCH /api/students/:id');
    console.log('  DELETE /api/students/:id');
    console.log('  GET  /api/fees/search?name=...');
    console.log('  GET  /api/fees/:studentId');
    console.log('  PATCH /api/fees/:studentId');
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
