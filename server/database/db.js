// ========================================
// Database Configuration & Management (db.js)
// ========================================
// Purpose: Initialize SQLite database, create tables, and manage database connections
// Handles: Table creation, migrations, default data insertion, and connection pooling
// ========================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Set database storage location in data/ directory
const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'expenses.db');

let db = null;

// Initialize database connection
// Creates data directory if it doesn't exist and opens SQLite connection
// Ensures database is ready for queries before returning
const init = () => {
  return new Promise((resolve, reject) => {
    // Ensure data directory exists for database file storage
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log('Created data directory:', DATA_DIR);
      }
    } catch (err) {
      console.error('Error creating data directory:', err);
      // Continue anyway, might work in some environments
    }

    // Open database connection - creates file if it doesn't exist
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

// Create all database tables with proper structure
// Handles: Table creation, index creation, and schema migrations
// Ensures data persistence by creating normalized database schema
const createTables = () => {
  return new Promise((resolve, reject) => {
    // Helper function to execute SQL queries sequentially
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

    // Main tables for expense tracking
    const tableQueries = [
      // Expenses table: stores individual expense records
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
      // Expense types lookup table: predefined categories for expenses
      `CREATE TABLE IF NOT EXISTS expense_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        transfer_account TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    // Create indexes for faster queries on frequently searched columns
    const indexQueries = [
      `CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date)`,
      `CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(expense_type)`,
      `CREATE INDEX IF NOT EXISTS idx_expenses_workplace ON expenses(workplace)`
    ];

    // Migration queries to update existing database schema
    const migrationQueries = [
      `ALTER TABLE expenses ADD COLUMN workplace TEXT DEFAULT 'Kebab 23'`
    ];

    // Execute all queries sequentially to ensure proper table creation
    Promise.resolve()
      .then(() => {
        // Create main tables first
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
        // Run migrations (add new columns if needed)
        return migrationQueries.reduce((promise, query) => {
          return promise.then(() => runQuery(query).catch(() => {
            // Ignore migration errors - column might already exist
          }));
        }, Promise.resolve());
      })
      .then(() => {
        // Insert default expense types after tables are created
        return insertDefaultTypes();
      })
      .then(resolve)
      .catch((err) => {
        console.error('Error creating tables:', err);
        reject(err);
      });
  });
};

// Insert predefined expense type categories into database
// These categories are used for filtering and organizing expenses
// Only inserts if they don't already exist (using INSERT OR IGNORE)
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

    // Prepare insert statement for data persistence
    const stmt = db.prepare('INSERT OR IGNORE INTO expense_types (name, transfer_account) VALUES (?, ?)');
    let completed = 0;

    // Insert each default type and track completion
    defaultTypes.forEach((type) => {
      stmt.run([type.name, type.transfer_account], (err) => {
        if (err) {
          console.error('Error inserting default type:', err);
        }
        completed++;
        // Finalize statement after all inserts complete
        if (completed === defaultTypes.length) {
          stmt.finalize();
          resolve();
        }
      });
    });
  });
};

// Retrieve database connection instance
// Throws error if database hasn't been initialized yet
const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

// Close database connection gracefully
// Used on server shutdown to ensure data is properly committed
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
