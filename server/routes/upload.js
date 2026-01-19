const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const db = require('../database/db');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/excel', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Find the Input_Expenses sheet
    let expensesSheet = null;
    for (const name of workbook.SheetNames) {
      if (name.toLowerCase().includes('input') || name.toLowerCase().includes('expense')) {
        expensesSheet = workbook.Sheets[name];
        break;
      }
    }

    if (!expensesSheet) {
      expensesSheet = worksheet; // Use first sheet if no match found
    }

    const expenses = XLSX.utils.sheet_to_json(expensesSheet);
    const imported = [];
    const errors = [];

    expenses.forEach((row, index) => {
      // Map Excel columns to our format
      const date = row.Date || row.date;
      const description = row.Description || row.description || '';
      const amount = parseFloat(row.Amount || row.amount);
      const account = row.Account || row.account || 'Card';
      const expenseType = row['Expense Type'] || row['Expense Type'] || row.expense_type || 'Other Expenses';

      if (!date || isNaN(amount) || !description) {
        errors.push(`Row ${index + 2}: Missing required fields`);
        return;
      }

      // Insert into database
      db.getDb().run(
        'INSERT INTO expenses (date, description, amount, account, expense_type) VALUES (?, ?, ?, ?, ?)',
        [date, description, amount, account, expenseType],
        function(err) {
          if (err) {
            errors.push(`Row ${index + 2}: ${err.message}`);
          } else {
            imported.push({ id: this.lastID, date, description, amount, account, expense_type: expenseType });
          }
        }
      );
    });

    // Wait a bit for async inserts to complete
    setTimeout(() => {
      res.json({
        message: `Imported ${imported.length} expenses`,
        imported: imported.length,
        errors: errors.length,
        errorDetails: errors
      });
    }, 1000);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
