const express = require('express');
const { query } = require('../config/db');

const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/dashboard/stats - Dashboard statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const [studentsResult, feesResult] = await Promise.all([
      query('SELECT COUNT(*) as count FROM students'),
      query(`
        SELECT 
          COALESCE(SUM(fees_paid), 0) as fees_collected,
          COALESCE(SUM(total_fees - fees_paid), 0) as fees_pending
        FROM students
      `),
    ]);

    const studentsEnrolled = parseInt(studentsResult.rows[0].count, 10);
    const feesCollected = parseInt(feesResult.rows[0].fees_collected, 10);
    const feesPending = parseInt(feesResult.rows[0].fees_pending, 10);

    res.json({
      studentsEnrolled,
      feesCollected,
      feesPending,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;
