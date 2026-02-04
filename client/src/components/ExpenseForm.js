// ========================================
// Expense Form Component
// ========================================
// Purpose: Form for creating and editing expense records
// Features: Date input, description, amount, account selection, expense type dropdown
// ========================================

import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ onSubmit, expenseTypes, editingExpense, onCancel }) => {
  // Initialize form with today's date and default values
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    account: 'Card',
    expense_type: expenseTypes[0] || 'Other Expenses'
  });

  // Load existing expense data when editing
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        date: editingExpense.date,
        description: editingExpense.description,
        amount: editingExpense.amount,
        account: editingExpense.account,
        expense_type: editingExpense.expense_type
      });
    }
  }, [editingExpense]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for creating or updating expenses
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.date || !formData.description || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    // Submit form data and convert amount to number
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    // Reset form if creating new expense (not editing)
    if (!editingExpense) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        account: 'Card',
        expense_type: expenseTypes[0] || 'Other Expenses'
      });
    }
  };

  return (
    <div className="expense-form">
      <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Date field */}
        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description field */}
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter expense description"
            required
          />
        </div>

        {/* Amount field - converted to Hungarian Forint */}
        <div className="form-group">
          <label htmlFor="amount">Amount (Ft) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        {/* Account selection (Cash or Card) */}
        <div className="form-group">
          <label htmlFor="account">Account *</label>
          <select
            id="account"
            name="account"
            value={formData.account}
            onChange={handleChange}
            required
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>

        {/* Expense type dropdown - fetched from database */}
        <div className="form-group">
          <label htmlFor="expense_type">Expense Type *</label>
          <select
            id="expense_type"
            name="expense_type"
            value={formData.expense_type}
            onChange={handleChange}
            required
          >
            {expenseTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Form action buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
