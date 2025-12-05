const express = require('express');
const db = require('../db'); // this is db/index.js
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await db.getActiveProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
