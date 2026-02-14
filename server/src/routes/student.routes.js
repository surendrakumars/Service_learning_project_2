const express = require('express');
const { query } = require('../config/db');

const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/students - List all students (optional: ?search=name)
router.get('/', protect, async (req, res) => {
  try {
    const { search } = req.query;
    let result;

    if (search) {
      result = await query(
        `SELECT * FROM students 
         WHERE LOWER(name) LIKE LOWER($1) 
         ORDER BY name`,
        [`%${search}%`]
      );
    } else {
      result = await query('SELECT * FROM students ORDER BY name');
    }

    res.json(result.rows);
  } catch (err) {
    console.error('List students error:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET /api/students/:id - Get single student
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM students WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get student error:', err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// POST /api/students - Add new student
router.post('/', async (req, res) => {
  try {
    const { name, grade, father_name, mother_name, mobile_no, fees_paid } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Student name is required' });
    }

    const result = await query(
      `INSERT INTO students (name, grade, father_name, mother_name, mobile_no, fees_paid)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        grade || null,
        father_name || null,
        mother_name || null,
        mobile_no || null,
        parseInt(fees_paid, 10) || 0,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add student error:', err);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// PATCH /api/students/:id - Update student (partial update)
router.patch('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grade, father_name, mother_name, mobile_no, fees_paid, teacher } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (grade !== undefined) {
      updates.push(`grade = $${paramCount++}`);
      values.push(grade);
    }
    if (father_name !== undefined) {
      updates.push(`father_name = $${paramCount++}`);
      values.push(father_name);
    }
    if (mother_name !== undefined) {
      updates.push(`mother_name = $${paramCount++}`);
      values.push(mother_name);
    }
    if (mobile_no !== undefined) {
      updates.push(`mobile_no = $${paramCount++}`);
      values.push(mobile_no);
    }
    if (fees_paid !== undefined) {
      updates.push(`fees_paid = $${paramCount++}`);
      values.push(parseInt(fees_paid, 10));
    }
    if (teacher !== undefined) {
      updates.push(`teacher = $${paramCount++}`);
      values.push(teacher);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE students SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE /api/students/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM students WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// DELETE /api/students/by-name/:name - Delete by student name
router.delete('/by-name/:name', protect, async (req, res) => {
  try {
    const { name } = req.params;
    const result = await query(
      'DELETE FROM students WHERE LOWER(name) = LOWER($1) RETURNING id',
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;
