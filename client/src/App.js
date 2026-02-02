import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import ExcelUpload from './components/ExcelUpload';

// Use relative API path for production, fallback to localhost for dev
const API_URL = process.env.REACT_APP_API_URL || '/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workplace, setWorkplace] = useState(() => localStorage.getItem('workplace') || null);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ byType: [], byAccount: [], total: { grand_total: 0, total_count: 0 } });
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');

  useEffect(() => {
    if (workplace) {
      fetchExpenses();
      fetchSummary();
      fetchExpenseTypes();
    }
  }, [workplace, fetchExpenses, fetchSummary, fetchExpenseTypes]);

  const fetchExpenses = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (workplace) params.append('workplace', workplace);
      const response = await fetch(`${API_URL}/expenses?${params.toString()}`);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }, [workplace]);

  const fetchSummary = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (workplace) params.append('workplace', workplace);
      const [byType, byAccount, total] = await Promise.all([
        fetch(`${API_URL}/expenses/summary/by-type?${params.toString()}`).then(r => r.json()),
        fetch(`${API_URL}/expenses/summary/by-account?${params.toString()}`).then(r => r.json()),
        fetch(`${API_URL}/expenses/summary/total?${params.toString()}`).then(r => r.json())
      ]);
      setSummary({ byType, byAccount, total });
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }, [workplace]);

  const fetchExpenseTypes = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/expenses/types/list`);
      const data = await response.json();
      setExpenseTypes(data.map(t => t.name));
    } catch (error) {
      console.error('Error fetching expense types:', error);
    }
  }, []);

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
        body: JSON.stringify({ ...expense, workplace })
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
    const params = new URLSearchParams();
    if (workplace) params.set('workplace', workplace);
    if (exportStartDate) params.set('start_date', exportStartDate);
    if (exportEndDate) params.set('end_date', exportEndDate);

    fetch(`${API_URL}/expenses/export/gnucash?${params.toString()}`)
      .then(async res => {
        if (!res.ok) throw new Error('Export failed');
        const blob = await res.blob();
        const disposition = res.headers.get('Content-Disposition') || '';
        let filename = 'gnucash_export.csv';
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match) filename = match[1];
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error(err);
        alert('Export failed');
      });
  };

  const selectWorkplace = (wp) => {
    setWorkplace(wp);
    localStorage.setItem('workplace', wp);
  };

  const goBack = () => {
    setWorkplace(null);
    localStorage.removeItem('workplace');
  };

  if (!workplace) {
    return (
      <div className="App">
        <div className="landing-page">
          <div className="landing-content">
            <h1 className="landing-title">💰 Expense Tracker</h1>
            <p className="landing-subtitle">Select your workplace to continue</p>
            <div className="workplace-cards">
              <button className="workplace-card" onClick={() => selectWorkplace('Kebab 23')}>
                <span className="workplace-icon">🥙</span>
                <span className="workplace-name">Kebab 23</span>
              </button>
              <button className="workplace-card" onClick={() => selectWorkplace('Pesti Forno')}>
                <span className="workplace-icon">🍕</span>
                <span className="workplace-name">Pesti Forno</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <button className="btn btn-secondary back-btn" onClick={goBack}>← Back</button>
          <h1>💰 Expense Tracker</h1>
        </div>
        <div className="workplace-info">
          <span className="current-workplace">{workplace}</span>
        </div>
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
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto'}}>
          <input type="date" value={exportStartDate} onChange={e => setExportStartDate(e.target.value)} placeholder="From" style={{height: '32px', padding: '4px'}} />
          <input type="date" value={exportEndDate} onChange={e => setExportEndDate(e.target.value)} placeholder="To" style={{height: '32px', padding: '4px'}} />
          <button onClick={handleExport} className="export-btn">
            💾 Export CSV
          </button>
        </div>
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
