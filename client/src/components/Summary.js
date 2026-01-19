import React from 'react';

const Summary = ({ summary }) => {
  return (
    <div className="summary">
      <div className="summary-section">
        <h2>Summary by Expense Type</h2>
        {summary.byType.length > 0 ? (
          summary.byType.map((item, index) => (
            <div key={index} className="summary-item">
              <div>
                <div className="summary-item-name">{item.expense_type || '(blank)'}</div>
                <div className="summary-item-count">{item.count} expenses</div>
              </div>
              <div className="summary-item-amount">${parseFloat(item.total_amount).toFixed(2)}</div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No expenses to summarize.
          </p>
        )}
      </div>

      <div className="summary-section">
        <h2>Summary by Account</h2>
        {summary.byAccount.length > 0 ? (
          summary.byAccount.map((item, index) => (
            <div key={index} className="summary-item">
              <div>
                <div className="summary-item-name">{item.account}</div>
                <div className="summary-item-count">{item.count} transactions</div>
              </div>
              <div className="summary-item-amount">${parseFloat(item.total_amount).toFixed(2)}</div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No account data available.
          </p>
        )}
      </div>

      <div className="summary-section">
        <div className="summary-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h3>Grand Total</h3>
          <div className="amount">${summary.total.grand_total.toFixed(2)}</div>
          <div className="count">{summary.total.total_count} total expenses</div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
