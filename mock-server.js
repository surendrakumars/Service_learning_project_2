const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

// JWT Secret (same as backend)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Middleware
app.use(cors());
app.use(express.json());

// Mock login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('LOGIN HIT', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  const emailLower = String(email).toLowerCase();

  // Check for admin credentials
  if (emailLower === 'admin@cambridgekids.com' && password === 'admin123') {
    const token = jwt.sign(
      { id: 'admin_id', email: emailLower },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      data: {
        token: token,
        user: {
          id: 'admin_id',
          name: 'Admin User',
          email: emailLower
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }
});

// Mock dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalStudents: 25,
      totalFeesCollected: 125000
    }
  });
});

let mockStudents = [
  {
    _id: '1',
    name: 'John Doe',
    grade: 'Grade 1',
    father_name: 'Mr. Doe',
    mother_name: 'Mrs. Doe',
    mobile_no: '9876543210',
    fees_paid: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Jane Smith',
    grade: 'Grade 2',
    father_name: 'Mr. Smith',
    mother_name: 'Mrs. Smith',
    mobile_no: '9876543211',
    fees_paid: 6000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Bob Johnson',
    grade: 'Grade 3',
    father_name: 'Mr. Johnson',
    mother_name: 'Mrs. Johnson',
    mobile_no: '9876543212',
    fees_paid: 4500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const findStudentIndex = (id) => mockStudents.findIndex((s) => s._id === id);

// Mock students list
app.get('/api/students', (req, res) => {
  res.json({
    success: true,
    data: mockStudents
  });
});

// Mock individual student
app.get('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const index = findStudentIndex(id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }
  return res.json({
    success: true,
    data: mockStudents[index]
  });
});

// Add new student
app.post('/api/students', (req, res) => {
  const { name, grade, father_name, mother_name, mobile_no, fees_paid } = req.body;
  if (!name || !father_name || !mother_name || !mobile_no) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  const now = new Date().toISOString();
  const newStudent = {
    _id: String(Date.now()),
    name,
    grade: grade || null,
    father_name,
    mother_name,
    mobile_no,
    fees_paid: Number.isFinite(Number(fees_paid)) ? Number(fees_paid) : 0,
    createdAt: now,
    updatedAt: now
  };
  mockStudents = [...mockStudents, newStudent];
  return res.status(201).json({
    success: true,
    data: newStudent
  });
});

// Update student
app.patch('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const index = findStudentIndex(id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }

  const current = mockStudents[index];
  const next = {
    ...current,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  mockStudents = mockStudents.map((student, idx) => (idx === index ? next : student));
  return res.json({
    success: true,
    data: next
  });
});

// Delete student
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const index = findStudentIndex(id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }

  mockStudents = mockStudents.filter((student) => student._id !== id);
  return res.json({
    success: true,
    message: 'Student deleted',
    data: { id }
  });
});

// Mock fee payment
app.post('/api/fees/pay', (req, res) => {
  const { studentId, amount } = req.body;

  res.json({
    success: true,
    data: {
      _id: 'fee_' + Date.now(),
      studentId,
      amount,
      date: new Date().toISOString()
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Mock Cambridge Kids API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Cambridge Kids API server running on port ${PORT}`);
  console.log(`📊 Login credentials: admin@cambridgekids.com / admin123`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
});
