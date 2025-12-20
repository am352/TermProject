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
        INSERT INTO products (name, description, price_cents, subject_family, in_stock, image_path, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `);

    const seed = [
      ['Campbell Biology', 'Introductory biology textbook.', 7500, 'Biology', 10, 'campbell-biology.jpg'],
      ['Principles of Economics', 'Economics textbook by Mankiw.', 10000, 'Economics', 8, 'principles-of-econ.jpg'],
      ['Calculus: Early Transcendentals', 'Calculus textbook by Stewart.', 15500, 'Mathematics', 6, 'calculus-early-trans.jpg'],
      ['Psychology', 'Psychology textbook by David G. Myers.', 14000, 'Psychology', 7, 'psychology-myers.jpg'],
      ['University Physics', 'Physics textbook by Young & Freedman.', 17500, 'Physics', 5, 'university-physics.jpg'],
      ['Artificial Intelligence: A Modern Approach', 'AI textbook by Russell & Norvig.', 9000, 'Computer Science', 4, 'ai-modern-approach.jpg'],
      ['Introduction to Algorithms', 'Algorithms textbook (CLRS).', 5500, 'Computer Science', 9, 'intro-to-algorithms.jpg'],
      ['Economics', 'Economics textbook by Samuelson & Nordhaus.', 14000, 'Economics', 6, 'economics-samuelson.jpg'],
      ['Statistics', 'Introductory statistics textbook.', 11000, 'Mathematics', 8, 'statistics-devore.jpg'],
      ['Writing/Composition Guide', 'General writing and composition guide.', 2000, 'Writing', 12, 'writing-composition-guide.jpg'],
      ['Linear Algebra', 'Linear algebra concepts and applications.', 7000, 'Mathematics', 6, 'linear-algebra-apps.jpg'],
      ['Discrete Mathematics', 'Logic, proofs, and discrete structures.', 7500, 'Mathematics', 10, 'discrete-math-rosen.jpg'],
      ['Master Theory', 'Introductory Music Theory textbook', 7500, 'Music Theory', 10, 'master-theory-peters.jpg'],
      ['Introduction to Philosophy', 'Introductory Philosophy textbook.', 7500, 'Philosophy', 10, 'intro-philosophy.jpg'],
      ['Elements of Art', 'A textbook on art concepts and techniques.', 7500, 'Art', 10, 'elements-of-art-hodge.jpg'],
      ['Cell Biology', 'Complex topics regarding Cell Biology.', 7500, 'Biology', 10, 'cell-biology.jpg'],
      ['Organic Chemistry', 'Complex topics regarding Organic Chemistry.', 7500, 'Chemistry', 10, 'organic-chemistry-clayden.jpg'],
      ['Applied Linear Algebra', 'Applied Linear Algebra concepts and applications.', 7500, 'Linear Algebra', 10, 'applied-linear-algebra-shakiban.jpg'],
      ['World History', 'Introductory World History textbook.', 7500, 'History', 10, 'world-history-glencoe.jpg'],
      ['Linear Algebra Done Right', 'A textbook on linear algebra concepts and applications.', 7500, 'Linear Algebra', 10, 'linear-algebra-axler.jpg']
    ];

      for (const p of seed)
        stmt.run(...p);

      stmt.finalize(() => db.close());
    });
  });
});
