const express = require('express');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/fees/pay
router.post('/pay', protect, async (req, res) => {
  try {
    const { studentId, amount } = req.body;
    const numericAmount = Number(amount);

    if (!studentId || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid payment details' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const fee = await Fee.create({
      studentId: student._id,
      amount: numericAmount,
      date: new Date(),
    });

    student.fees_paid = (Number(student.fees_paid) || 0) + numericAmount;
    await student.save();

    return res.json({
      success: true,
      data: {
        _id: String(fee._id),
        studentId: String(fee.studentId),
        amount: fee.amount,
        date: fee.date.toISOString(),
      },
    });
  } catch (error) {
    console.error('Pay fee error:', error);
    return res.status(500).json({ success: false, error: 'Failed to record fee payment' });
  }
});

module.exports = router;
