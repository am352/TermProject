const express = require('express');
const db = require('../db');
const router = express.Router();

const DEMO_CUSTOMER_ID = 1;

router.get('/', async (req, res) => {
  try {
    const items = await db.getCartItems(DEMO_CUSTOMER_ID);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });

    const qty = quantity ? Number(quantity) : 1;
    const result = await db.addToCart(DEMO_CUSTOMER_ID, productId, qty);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/clear', async (req, res) => {
  try {
    const removed = await db.clearCart(DEMO_CUSTOMER_ID);
    res.json({ cleared: removed });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
