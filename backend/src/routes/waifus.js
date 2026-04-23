const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const router  = express.Router();
const { pool } = require('../db');

// ── Multer config ─────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `waifu-${req.params.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// ── GET /api/waifus ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { anime, hair_color, search, sort = 'rating', order = 'DESC' } = req.query;

    let query = 'SELECT * FROM waifus WHERE 1=1';
    const params = [];
    let n = 1;

    if (anime) {
      query += ` AND LOWER(anime) LIKE LOWER($${n++})`;
      params.push(`%${anime}%`);
    }
    if (hair_color) {
      query += ` AND LOWER(hair_color) = LOWER($${n++})`;
      params.push(hair_color);
    }
    if (search) {
      query += ` AND (LOWER(name) LIKE LOWER($${n}) OR LOWER(anime) LIKE LOWER($${n}))`;
      params.push(`%${search}%`);
      n++;
    }

    const validSort = ['rating', 'name', 'anime', 'created_at'];
    const sortField = validSort.includes(sort) ? sort : 'rating';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const { rows } = await pool.query(query, params);
    res.json({ data: rows, total: rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch waifus' });
  }
});

// ── GET /api/waifus/:id ───────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM waifus WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Waifu not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch waifu' });
  }
});

// ── POST /api/waifus ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, anime, description, image_url, hair_color, personality, rating } = req.body;
    if (!name || !anime) {
      return res.status(400).json({ error: 'name and anime are required' });
    }
    const { rows } = await pool.query(
      `INSERT INTO waifus (name, anime, description, image_url, hair_color, personality, rating)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, anime, description, image_url, hair_color, personality, rating || 0],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create waifu' });
  }
});

// ── POST /api/waifus/:id/image  (upload fichier) ─────────────────────────────
router.post('/:id/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    const imageUrl = `/uploads/${req.file.filename}`;
    const { rows } = await pool.query(
      'UPDATE waifus SET image_url = $1 WHERE id = $2 RETURNING *',
      [imageUrl, req.params.id],
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Waifu not found' });

    res.json({ image_url: imageUrl, waifu: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// ── PATCH /api/waifus/:id/image  (mettre à jour l'URL) ───────────────────────
router.patch('/:id/image', async (req, res) => {
  try {
    const { image_url } = req.body;
    if (!image_url) return res.status(400).json({ error: 'image_url is required' });

    const { rows } = await pool.query(
      'UPDATE waifus SET image_url = $1 WHERE id = $2 RETURNING *',
      [image_url, req.params.id],
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Waifu not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update image URL' });
  }
});

module.exports = router;
