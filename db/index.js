const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'data', 'book-shop.db');
const db = new sqlite3.Database(dbPath);

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );
});

function createUser({ username, email, passwordHash }) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
    db.run(sql, [username, email, passwordHash], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, username, email });
    });
  });
}

function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function findUserById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

async function getActiveProducts() {
  return all(
    `SELECT id, name, description, price_cents, subject_family, in_stock
     FROM products WHERE is_active = 1 ORDER BY name ASC`
  );
}

async function getProductById(id) {
  return get(
    `SELECT id, name, description, price_cents, subject_family, in_stock
     FROM products WHERE id = ? AND is_active = 1`,
    [id]
  );
}

async function getCartItems(customerId) {
  return all(
    `SELECT
       cart_items.id AS cart_item_id,
       cart_items.quantity,
       products.id AS product_id,
       products.name,
       products.price_cents
     FROM cart_items
     JOIN products ON cart_items.product_id = products.id
     WHERE cart_items.customer_id = ?`,
    [customerId]
  );
}

async function addToCart(customerId, productId, quantity = 1) {
  const existing = await get(
    `SELECT id, quantity FROM cart_items
     WHERE customer_id = ? AND product_id = ?`,
    [customerId, productId]
  );

  if (existing) {
    const newQty = existing.quantity + quantity;
    await run(
      `UPDATE cart_items SET quantity = ? WHERE id = ?`,
      [newQty, existing.id]
    );
    return { updated: true, quantity: newQty };
  }

  const result = await run(
    `INSERT INTO cart_items (customer_id, product_id, quantity)
     VALUES (?, ?, ?)`,
    [customerId, productId, quantity]
  );

  return { inserted: true, id: result.id };
}

async function clearCart(customerId) {
  const result = await run(
    `DELETE FROM cart_items WHERE customer_id = ?`,
    [customerId]
  );
  return result.changes;
}

module.exports = {
  db,
  all,
  get,
  run,
  getActiveProducts,
  getProductById,
  getCartItems,
  addToCart,
  clearCart,
   createUser,
  findUserByUsername,
  findUserByEmail,
  findUserById
};
