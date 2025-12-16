const express = require('express');
const path = require('path');
const session = require('express-session');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

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
