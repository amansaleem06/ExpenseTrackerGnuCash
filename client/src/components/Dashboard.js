// ========================================
// Dashboard Component
// ========================================
// Purpose: Main dashboard view showing expense overview and recent transactions
// Currency: Hungarian Forint (Ft)
// ========================================

import React from 'react';
import ExpenseList from './ExpenseList';

// Format currency values to Hungarian Forint
const formatCurrency = (amount) => {
  return `${parseFloat(amount).toFixed(2)} Ft`;
};

const Dashboard = ({ expenses, summary, onEdit, onDelete }) => {
  // Display only the 5 most recent expenses
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="dashboard">
      {/* Summary cards showing grand total and account breakdown */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Grand Total</h3>
          <div className="amount">{formatCurrency(summary.total.grand_total)}</div>
          <div className="count">{summary.total.total_count} expenses</div>
        </div>
        
        {/* Display each account with its total and transaction count */}
        {summary.byAccount.map((account, index) => (
          <div key={index} className="summary-card" style={{
            background: index === 0 
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          }}>
            <h3>{account.account}</h3>
            <div className="amount">{formatCurrency(account.total_amount)}</div>
            <div className="count">{account.count} transactions</div>
          </div>
        ))}
      </div>

      {/* Recent expenses list with edit/delete options */}
      <div className="recent-expenses">
        <h2>Recent Expenses</h2>
        {recentExpenses.length > 0 ? (
          <ExpenseList 
            expenses={recentExpenses} 
            onEdit={onEdit}
            onDelete={onDelete}
            showAll={false}
          />
        ) : (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No expenses yet. Add your first expense!
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
