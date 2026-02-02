const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'expenses.db');

let db = null;

const init = () => {
  return new Promise((resolve, reject) => {
    // Ensure data directory exists
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log('Created data directory:', DATA_DIR);
      }
    } catch (err) {
      console.error('Error creating data directory:', err);
      // Continue anyway, might work in some environments
    }

    // Open database
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        console.error('Database path:', DB_PATH);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database at:', DB_PATH);
      createTables().then(resolve).catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    // Execute queries sequentially to ensure tables are created before indexes
    const runQuery = (query) => {
      return new Promise((resolveQuery, rejectQuery) => {
        db.run(query, (err) => {
          if (err) {
            rejectQuery(err);
          } else {
            resolveQuery();
          }
        });
      });
    };

    // Create tables first
    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        account TEXT NOT NULL,
        expense_type TEXT NOT NULL,
        workplace TEXT DEFAULT 'Kebab 23',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS expense_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        transfer_account TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    // Create indexes after tables
    const indexQueries = [
      `CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date)`,
      `CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(expense_type)`,
      `CREATE INDEX IF NOT EXISTS idx_expenses_workplace ON expenses(workplace)`
    ];

    // Migration queries to add workplace column if needed
    const migrationQueries = [
      `ALTER TABLE expenses ADD COLUMN workplace TEXT DEFAULT 'Kebab 23'`
    ];

    // Execute all queries sequentially
    Promise.resolve()
      .then(() => {
        // Create tables
        return tableQueries.reduce((promise, query) => {
          return promise.then(() => runQuery(query));
        }, Promise.resolve());
      })
      .then(() => {
        // Create indexes after tables exist
        return indexQueries.reduce((promise, query) => {
          return promise.then(() => runQuery(query).catch(() => {
            // Ignore index creation errors - might already exist
          }));
        }, Promise.resolve());
      })
      .then(() => {
        // Run migrations (add workplace column if needed)
        return migrationQueries.reduce((promise, query) => {
          return promise.then(() => runQuery(query).catch(() => {
            // Ignore migration errors - column might already exist
          }));
        }, Promise.resolve());
      })
      .then(() => {
        // Insert default expense types
        return insertDefaultTypes();
      })
      .then(resolve)
      .catch((err) => {
        console.error('Error creating tables:', err);
        reject(err);
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
