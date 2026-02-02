const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all expenses
router.get('/', (req, res) => {
  const { startDate, endDate, expenseType, workplace } = req.query;
  let query = 'SELECT * FROM expenses WHERE 1=1';
  const params = [];

  if (workplace) {
    query += ' AND workplace = ?';
    params.push(workplace);
  }
  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }
  if (expenseType) {
    query += ' AND expense_type = ?';
    params.push(expenseType);
  }

  query += ' ORDER BY date DESC, created_at DESC';

  db.getDb().all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get expense by ID
router.get('/:id', (req, res) => {
  db.getDb().get('SELECT * FROM expenses WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.json(row);
  });
});

// Create expense
router.post('/', (req, res) => {
  const { date, description, amount, account, expense_type, workplace } = req.body;

  if (!date || !description || amount === undefined || !account || !expense_type || !workplace) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  db.getDb().run(
    'INSERT INTO expenses (date, description, amount, account, expense_type, workplace) VALUES (?, ?, ?, ?, ?, ?)',
    [date, description, amount, account, expense_type, workplace],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, date, description, amount, account, expense_type, workplace });
    }
  );
});

// Update expense
router.put('/:id', (req, res) => {
  const { date, description, amount, account, expense_type, workplace } = req.body;

  if (!date || !description || amount === undefined || !account || !expense_type || !workplace) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  db.getDb().run(
    'UPDATE expenses SET date = ?, description = ?, amount = ?, account = ?, expense_type = ?, workplace = ? WHERE id = ?',
    [date, description, amount, account, expense_type, workplace, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Expense not found' });
        return;
      }
      res.json({ id: req.params.id, date, description, amount, account, expense_type, workplace });
    }
  );
});

// Delete expense
router.delete('/:id', (req, res) => {
  db.getDb().run('DELETE FROM expenses WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.json({ message: 'Expense deleted successfully' });
  });
});

// Get expense summary by type
router.get('/summary/by-type', (req, res) => {
  const { startDate, endDate, workplace } = req.query;
  let query = `
    SELECT 
      expense_type,
      SUM(amount) as total_amount,
      COUNT(*) as count
    FROM expenses
    WHERE 1=1
  `;
  const params = [];

  if (workplace) {
    query += ' AND workplace = ?';
    params.push(workplace);
  }
  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }

  query += ' GROUP BY expense_type ORDER BY total_amount DESC';

  db.getDb().all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get expense summary by account
router.get('/summary/by-account', (req, res) => {
  const { startDate, endDate, workplace } = req.query;
  let query = `
    SELECT 
      account,
      SUM(amount) as total_amount,
      COUNT(*) as count
    FROM expenses
    WHERE 1=1
  `;
  const params = [];

  if (workplace) {
    query += ' AND workplace = ?';
    params.push(workplace);
  }
  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }

  query += ' GROUP BY account ORDER BY total_amount DESC';

  db.getDb().all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get total summary
router.get('/summary/total', (req, res) => {
  const { startDate, endDate, workplace } = req.query;
  let query = 'SELECT SUM(amount) as grand_total, COUNT(*) as total_count FROM expenses WHERE 1=1';
  const params = [];

  if (workplace) {
    query += ' AND workplace = ?';
    params.push(workplace);
  }
  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }

  db.getDb().get(query, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      grand_total: row.grand_total || 0,
      total_count: row.total_count || 0
    });
  });
});

// Export to CSV format for GnuCash
router.get('/export/gnucash', (req, res) => {
  const { workplace } = req.query;
  let query = `
    SELECT 
      e.date,
      e.description,
      e.amount,
      COALESCE(et.transfer_account, 
        CASE 
          WHEN e.account = 'Cash' THEN 'Assets:Cash'
          WHEN e.account = 'Card' THEN 'Assets:Card'
          ELSE 'Assets:Card'
        END
      ) as transfer_account,
      e.expense_type
    FROM expenses e
    LEFT JOIN expense_types et ON e.expense_type = et.name
    WHERE 1=1
  `;
  const params = [];
  
  if (workplace) {
    query += ' AND e.workplace = ?';
    params.push(workplace);
  }
  
  query += ' ORDER BY e.date DESC';
  
  db.getDb().all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Convert to CSV
    const headers = ['Date', 'Description', 'Amount', 'Transfer Account', 'Expense Type'];
    const csvRows = [headers.join(',')];
    
    rows.forEach(row => {
      const values = [
        row.date,
        `"${row.description.replace(/"/g, '""')}"`,
        row.amount,
        row.transfer_account,
        `"${row.expense_type.replace(/"/g, '""')}"`
      ];
      csvRows.push(values.join(','));
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=gnucash_export.csv');
    res.send(csvRows.join('\n'));
  });
});

// Get expense types
router.get('/types/list', (req, res) => {
  db.getDb().all('SELECT * FROM expense_types ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add expense type
router.post('/types', (req, res) => {
  const { name, transfer_account } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  db.getDb().run(
    'INSERT INTO expense_types (name, transfer_account) VALUES (?, ?)',
    [name, transfer_account || 'Assets:Card'],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          res.status(400).json({ error: 'Expense type already exists' });
          return;
        }
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, transfer_account: transfer_account || 'Assets:Card' });
    }
  );
});

module.exports = router;
