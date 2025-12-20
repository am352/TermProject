const express = require('express');
const path = require('path');
const session = require('express-session');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.urlencoded({ extended: false }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 
    }
  })
);

// Expose session user + messages to all views
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.currentUser = {
      id: req.session.userId,
      username: req.session.username,
      email: req.session.email
    };
  } else {
    res.locals.currentUser = null;
  }

  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;

  delete req.session.success;
  delete req.session.error;

  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', profileRoutes);

app.get('/current-user', (req, res) => {
  if (req.session.userId) {
    res.json({
      id: req.session.userId,
      username: req.session.username,
      email: req.session.email
    });
  } else {
    res.json(null); // No user logged in
  }
});

const db = new sqlite3.Database(
  path.join(__dirname, 'data', 'book-shop.db')
);

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;

  db.get(
    'SELECT * FROM products WHERE id = ? AND is_active = 1',
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(row);
    }
  );
});

app.get('/api/products', (req, res) => {
  db.all(
    'SELECT id, name, price_cents, subject_family, image_path FROM products WHERE is_active = 1',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});


// Root
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/profile');
  res.redirect('/login');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
