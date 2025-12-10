const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'data', 'book-shop.db');
const schemaPath = path.join(__dirname, 'schema.sql');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const schema = fs.readFileSync(schemaPath, 'utf8');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.exec(schema, (err) => {
    if (err) {
      console.error('Schema error:', err);
      process.exit(1);
    }

    db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
      if (row.count > 0) {
        db.close();
        return;
      }

      const stmt = db.prepare(`
        INSERT INTO products (name, description, price_cents, subject_family, in_stock, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
      `);

      const seed = [
        ['Introduction to Computer Science', 'CS101 textbook.', 5999, 'Computer Science', 10],
        ['Data Structures and Algorithms', 'Advanced algorithms.', 8999, 'Computer Science', 8],
        ['Discrete Mathematics', 'Sets, proofs, logic.', 7499, 'Mathematics', 12],
        ['Linear Algebra', 'Matrices and vectors.', 6999, 'Mathematics', 6],
        ['Introduction to Psychology', 'Foundations of psychology.', 4999, 'Social Science', 5],
        ['World History: Modern Era', 'Modern history overview.', 6599, 'History', 7],
        ['Organic Chemistry I', 'Intro to O-chem.', 9999, 'Chemistry', 4],
        ['Physics for Scientists and Engineers', 'Calculus-based physics.', 8999, 'Physics', 9],
        ['Introduction to Statistics', 'Stats fundamentals.', 5499, 'Mathematics', 11],
        ['Business Finance', 'Corporate finance.', 7999, 'Business', 3],
        ['Art History Survey', 'Major works and movements.', 5599, 'Art', 6],
        ['Technical Writing Handbook', 'Guide to documentation.', 3999, 'Writing', 15]
      ];

      for (const p of seed)
        stmt.run(...p);

      stmt.finalize(() => db.close());
    });
  });
});
