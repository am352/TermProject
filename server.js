const express = require('express');
const path = require('path');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
