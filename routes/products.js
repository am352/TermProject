const express = require('express');
const db = require('../db'); 
const router = express.Router();

// GET all active products
router.get('/', async (req, res) => {
  try {
    const products = await db.getActiveProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
