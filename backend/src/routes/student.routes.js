const express = require('express');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  return next();
};

// GET /api/students
router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 }).lean();
    return res.json({ success: true, data: students });
  } catch (error) {
    console.error('List students error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch students' });
  }
});

// GET /api/students/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    return res.json({ success: true, data: student });
  } catch (error) {
    console.error('Get student error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch student' });
  }
});

// POST /api/students
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const { name, grade, father_name, mother_name, mobile_no, fees_paid } = req.body;
    if (!name || !father_name || !mother_name || !mobile_no) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const student = await Student.create({
      name,
      grade: grade || null,
      father_name,
      mother_name,
      mobile_no,
      fees_paid: Number.isFinite(Number(fees_paid)) ? Number(fees_paid) : 0,
    });
    return res.status(201).json({ success: true, data: student });
  } catch (error) {
    console.error('Add student error:', error);
    return res.status(500).json({ success: false, error: 'Failed to add student' });
  }
});

// PATCH /api/students/:id
router.patch('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const updates = {};
    const allowed = ['name', 'grade', 'father_name', 'mother_name', 'mobile_no', 'fees_paid', 'teacher'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    return res.json({ success: true, data: student });
  } catch (error) {
    console.error('Update student error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update student' });
  }
});

// DELETE /api/students/:id
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    return res.json({ success: true, message: 'Student deleted', data: { id: student._id } });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete student' });
  }
});

module.exports = router;
