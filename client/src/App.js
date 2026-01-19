import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import ExcelUpload from './components/ExcelUpload';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ byType: [], byAccount: [], total: { grand_total: 0, total_count: 0 } });
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
    fetchExpenseTypes();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/expenses`);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const [byType, byAccount, total] = await Promise.all([
        fetch(`${API_URL}/expenses/summary/by-type`).then(r => r.json()),
        fetch(`${API_URL}/expenses/summary/by-account`).then(r => r.json()),
        fetch(`${API_URL}/expenses/summary/total`).then(r => r.json())
      ]);
      setSummary({ byType, byAccount, total });
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchExpenseTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/expenses/types/list`);
      const data = await response.json();
      setExpenseTypes(data.map(t => t.name));
    } catch (error) {
      console.error('Error fetching expense types:', error);
    }
  };

  const handleAddExpense = async (expense) => {
    setLoading(true);
    try {
      const url = editingExpense 
        ? `${API_URL}/expenses/${editingExpense.id}`
        : `${API_URL}/expenses`;
      const method = editingExpense ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });

      if (response.ok) {
        await fetchExpenses();
        await fetchSummary();
        setEditingExpense(null);
        if (activeTab !== 'dashboard') setActiveTab('dashboard');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save expense');
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchExpenses();
        await fetchSummary();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setActiveTab('add');
  };

  const handleExcelUpload = async () => {
    await fetchExpenses();
    await fetchSummary();
    await fetchExpenseTypes();
  };

  const handleExport = () => {
    window.open(`${API_URL}/expenses/export/gnucash`, '_blank');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>💰 Expense Tracker</h1>
        <p className="subtitle">Manage your business expenses efficiently</p>
      </header>

      <nav className="nav-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => {
            setEditingExpense(null);
            setActiveTab('add');
          }}
        >
          ➕ Add Expense
        </button>
        <button 
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          📋 Expenses
        </button>
        <button 
          className={activeTab === 'summary' ? 'active' : ''}
          onClick={() => setActiveTab('summary')}
        >
          📈 Summary
        </button>
        <button 
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload Excel
        </button>
        <button onClick={handleExport} className="export-btn">
          💾 Export CSV
        </button>
      </nav>

      <main className="main-content">
        {loading && <div className="loading">Loading...</div>}
        
        {activeTab === 'dashboard' && (
          <Dashboard 
            expenses={expenses}
            summary={summary}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        )}
        
        {activeTab === 'add' && (
          <ExpenseForm 
            onSubmit={handleAddExpense}
            expenseTypes={expenseTypes}
            editingExpense={editingExpense}
            onCancel={() => {
              setEditingExpense(null);
              setActiveTab('dashboard');
            }}
          />
        )}
        
        {activeTab === 'list' && (
          <ExpenseList 
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        )}
        
        {activeTab === 'summary' && (
          <Summary summary={summary} />
        )}
        
        {activeTab === 'upload' && (
          <ExcelUpload 
            onUpload={handleExcelUpload}
            apiUrl={API_URL}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Expense Tracker © 2026 | Built for Small Business</p>
      </footer>
    </div>
  );
}

export default App;
