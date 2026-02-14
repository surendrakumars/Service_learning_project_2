const express = require('express');
const Student = require('../models/Student');
const Fee = require('../models/Fee');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const feeAgg = await Student.aggregate([
      {
        $group: {
          _id: null,
          totalFeesCollected: { $sum: '$fees_paid' },
        },
      },
    ]);
    const totalFeesCollected = feeAgg.length > 0 ? feeAgg[0].totalFeesCollected : 0;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthlyFeeAgg = await Fee.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          monthFeesCollected: { $sum: '$amount' },
        },
      },
    ]);
    const monthFeesCollected = monthlyFeeAgg.length > 0 ? monthlyFeeAgg[0].monthFeesCollected : 0;

    return res.json({
      success: true,
      data: {
        totalStudents,
        totalFeesCollected,
        monthFeesCollected,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;
