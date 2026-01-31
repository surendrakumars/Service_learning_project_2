const express = require('express');
const { query } = require('../config/db');

const router = express.Router();

// GET /api/fees/search?name=StudentName - Search student by name for fee info
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Student name is required for search' });
    }

    const result = await query(
      `SELECT id, name, father_name, mother_name, mobile_no, total_fees, fees_paid,
              (total_fees - fees_paid) as balance_fees
       FROM students
       WHERE LOWER(name) LIKE LOWER($1)`,
      [`%${name.trim()}%`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No student found with that name' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Fee search error:', err);
    res.status(500).json({ error: 'Failed to search student fees' });
  }
});

// GET /api/fees/:studentId - Get fee details for a student
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await query(
      `SELECT id, name, father_name, mother_name, mobile_no, total_fees, fees_paid,
              (total_fees - fees_paid) as balance_fees
       FROM students
       WHERE id = $1`,
      [studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get fee error:', err);
    res.status(500).json({ error: 'Failed to fetch fee details' });
  }
});

// PATCH /api/fees/:studentId - Update fees paid for a student
router.patch('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { fees_paid } = req.body;

    if (fees_paid === undefined) {
      return res.status(400).json({ error: 'fees_paid is required' });
    }

    const amount = parseInt(fees_paid, 10);
    if (isNaN(amount) || amount < 0) {
      return res.status(400).json({ error: 'fees_paid must be a positive number' });
    }

    const result = await query(
      `UPDATE students 
       SET fees_paid = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, name, total_fees, fees_paid, (total_fees - fees_paid) as balance_fees`,
      [amount, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update fee error:', err);
    res.status(500).json({ error: 'Failed to update fees' });
  }
});

module.exports = router;
