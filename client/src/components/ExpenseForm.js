import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ onSubmit, expenseTypes, editingExpense, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    account: 'Card',
    expense_type: expenseTypes[0] || 'Other Expenses'
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.description || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
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

        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
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
