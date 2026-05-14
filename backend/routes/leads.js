const express = require('express');
const router = express.Router();
const { body, query, param, validationResult } = require('express-validator');
const {pool} = require('../db');
const { verifyToken } = require('../middleware/auth');

// Apply auth to all lead routes
router.use(verifyToken);

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ─── GET all leads (with search & filter) ────────────────────────────────────
router.get('/', [
  query('search').optional().isString().trim(),
  query('status').optional().isIn(['New', 'Interested', 'Not Interested', 'Converted']),
  query('source').optional().isIn(['Call', 'WhatsApp', 'Field']),
], validate, async (req, res) => {
  try {
    const { search, status, source } = req.query;
    const userId = req.user.id;
    let conditions = ['user_id = $1'];
    let values = [userId];
    let idx = 2;

    if (search) {
      conditions.push(`(name ILIKE $${idx} OR phone ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }
    if (status) {
      conditions.push(`status = $${idx}`);
      values.push(status);
      idx++;
    }
    if (source) {
      conditions.push(`source = $${idx}`);
      values.push(source);
      idx++;
    }

    const where = `WHERE ${conditions.join(' AND ')}`;
    const result = await pool.query(
      `SELECT * FROM leads ${where} ORDER BY created_at DESC`,
      values
    );
    res.json({ leads: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET dashboard stats ──────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(`
      SELECT
        COUNT(*)                                           AS total,
        COUNT(*) FILTER (WHERE status = 'New')            AS new,
        COUNT(*) FILTER (WHERE status = 'Interested')     AS interested,
        COUNT(*) FILTER (WHERE status = 'Not Interested') AS not_interested,
        COUNT(*) FILTER (WHERE status = 'Converted')      AS converted,
        COUNT(*) FILTER (WHERE source = 'Call')           AS from_call,
        COUNT(*) FILTER (WHERE source = 'WhatsApp')       AS from_whatsapp,
        COUNT(*) FILTER (WHERE source = 'Field')          AS from_field,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS this_week
      FROM leads
      WHERE user_id = $1
    `, [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST create lead ─────────────────────────────────────────────────────────
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('phone').trim().notEmpty().withMessage('Phone is required')
    .matches(/^[\d\s\+\-\(\)]{7,20}$/).withMessage('Invalid phone number'),
  body('source').isIn(['Call', 'WhatsApp', 'Field']).withMessage('Source must be Call, WhatsApp, or Field'),
  body('notes').optional().trim().isLength({ max: 500 }),
], validate, async (req, res) => {
  try {
    const { name, phone, source, notes } = req.body;
    const userId = req.user.id;
    const result = await pool.query(
      `INSERT INTO leads (user_id, name, phone, source, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, name, phone, source, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT update lead status ───────────────────────────────────────────────────
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Invalid lead ID'),
  body('status').isIn(['New', 'Interested', 'Not Interested', 'Converted'])
    .withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 500 }),
], validate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    const fields = ['status = $1'];
    const values = [status];
    let idx = 2;

    if (notes !== undefined) {
      fields.push(`notes = $${idx}`);
      values.push(notes);
      idx++;
    }
    values.push(userId);
    values.push(id);

    const result = await pool.query(
      `UPDATE leads SET ${fields.join(', ')} WHERE user_id = $${idx} AND id = $${idx + 1} RETURNING *`,
      values
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE lead ──────────────────────────────────────────────────────────────
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Invalid lead ID'),
], validate, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'DELETE FROM leads WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
