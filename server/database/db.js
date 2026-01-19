const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/expenses.db');

let db = null;

const init = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
      createTables().then(resolve).catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    const queries = [
      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        account TEXT NOT NULL,
        expense_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS expense_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        transfer_account TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date)`,
      `CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(expense_type)`
    ];

    let completed = 0;
    queries.forEach((query) => {
      db.run(query, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          reject(err);
          return;
        }
        completed++;
        if (completed === queries.length) {
          // Insert default expense types
          insertDefaultTypes().then(resolve).catch(reject);
        }
      });
    });
  });
};

const insertDefaultTypes = () => {
  return new Promise((resolve, reject) => {
    const defaultTypes = [
      { name: 'Drinks(Cola,Hell,Dreher)', transfer_account: 'Assets:Card' },
      { name: 'Salaries', transfer_account: 'Assets:Cash' },
      { name: 'Personal Cash outs', transfer_account: 'Assets:Cash' },
      { name: 'Other Expenses', transfer_account: 'Assets:Card' },
      { name: 'Taxes', transfer_account: 'Assets:Card' },
      { name: 'Rent', transfer_account: 'Assets:Card' },
      { name: 'Utilities', transfer_account: 'Assets:Card' },
      { name: 'Ingridients', transfer_account: 'Assets:Card' }
    ];

    const stmt = db.prepare('INSERT OR IGNORE INTO expense_types (name, transfer_account) VALUES (?, ?)');
    let completed = 0;

    defaultTypes.forEach((type) => {
      stmt.run([type.name, type.transfer_account], (err) => {
        if (err) {
          console.error('Error inserting default type:', err);
        }
        completed++;
        if (completed === defaultTypes.length) {
          stmt.finalize();
          resolve();
        }
      });
    });
  });
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

const close = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  init,
  getDb,
  close
};
