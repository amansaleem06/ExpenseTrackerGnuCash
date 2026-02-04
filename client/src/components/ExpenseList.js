// ========================================
// Expense List Component
// ========================================
// Purpose: Display all expenses in a table format with edit/delete actions
// Currency: Hungarian Forint (Ft)
// ========================================

import React from 'react';

// Format currency values to Hungarian Forint
// Uses Ft symbol after the amount with 2 decimal places
const formatCurrency = (amount) => {
  return `${parseFloat(amount).toFixed(2)} Ft`;
};

const ExpenseList = ({ expenses, onEdit, onDelete, showAll = true }) => {
  const displayExpenses = showAll ? expenses : expenses;

  // Format date to readable format (e.g., "Jan 15, 2024")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (displayExpenses.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
        No expenses found.
      </p>
    );
  }

  return (
    <div className="expense-list">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Account</th>
            <th>Expense Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayExpenses.map((expense) => (
            <tr key={expense.id}>
              <td>{formatDate(expense.date)}</td>
              <td>{expense.description}</td>
              <td>{formatCurrency(expense.amount)}</td>
              <td>{expense.account}</td>
              <td>{expense.expense_type}</td>
              <td>
                <div className="actions">
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => onEdit(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => onDelete(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
