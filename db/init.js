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
      ['Campbell Biology', 'Introductory biology textbook.', 7500, 'Biology', 10],
      ['Principles of Economics', 'Economics textbook by Mankiw.', 10000, 'Economics', 8],
      ['Calculus: Early Transcendentals', 'Calculus textbook by Stewart.', 15500, 'Mathematics', 6],
      ['Psychology', 'Psychology textbook by David G. Myers.', 14000, 'Psychology', 7],
      ['University Physics', 'Physics textbook by Young & Freedman.', 17500, 'Physics', 5],
      ['Artificial Intelligence: A Modern Approach', 'AI textbook by Russell & Norvig.', 9000, 'Computer Science', 4],
      ['Introduction to Algorithms', 'Algorithms textbook (CLRS).', 5500, 'Computer Science', 9],
      ['Economics', 'Economics textbook by Samuelson & Nordhaus.', 14000, 'Economics', 6],
      ['Statistics', 'Introductory statistics textbook.', 11000, 'Mathematics', 8],
      ['Writing/Composition Guide', 'General writing and composition guide.', 2000, 'Writing', 12],
      ['Linear Algebra', 'Linear algebra concepts and applications.', 7000, 'Mathematics', 6],
      ['Discrete Mathematics', 'Logic, proofs, and discrete structures.', 7500, 'Computer Science', 10]

      ['Master Theory', 'Introductory Music Theory textbook', 7500, 'Music Theory', 10]
      ['Introduction to Philosophy', 'Introductory Philosophy textbook.', 7500, 'Philosophy', 10]
      ['Elements of Art', 'A textbook on art concepts and techniques.', 7500, 'Art', 10]
      ['Cell Biology', 'Complex topics regarding Cell Biology.', 7500, 'Biology', 10]
      ['Organic Chemistry', 'Complex topics regarding Organic Chemistry.', 7500, 'Chemistry', 10]
      ['Applied Linear Algebra', 'Applied Linear Algebra concepts and applications.', 7500, 'Linear Algebra', 10]
      ['World History', 'Introductory World History textbook.', 7500, 'History', 10]
      ['Linear Algebra Done Right', 'A textbook on linear algebra concepts and applications.', 7500, 'Linear Algebra', 10]
    ];

      for (const p of seed)
        stmt.run(...p);

      stmt.finalize(() => db.close());
    });
  });
});
