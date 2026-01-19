import React from 'react';
import ExpenseList from './ExpenseList';

const Dashboard = ({ expenses, summary, onEdit, onDelete }) => {
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="dashboard">
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Grand Total</h3>
          <div className="amount">${summary.total.grand_total.toFixed(2)}</div>
          <div className="count">{summary.total.total_count} expenses</div>
        </div>
        
        {summary.byAccount.map((account, index) => (
          <div key={index} className="summary-card" style={{
            background: index === 0 
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          }}>
            <h3>{account.account}</h3>
            <div className="amount">${account.total_amount.toFixed(2)}</div>
            <div className="count">{account.count} transactions</div>
          </div>
        ))}
      </div>

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
