// ========================================
// Main Server Entry Point (index.js)
// ========================================
// Purpose: Initialize Express server, configure middleware, 
// and establish database connection for the Expense Tracker API
// ========================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const expenseRoutes = require('./routes/expenses');
const uploadRoutes = require('./routes/upload');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Log server startup information
console.log(`Starting in ${NODE_ENV} mode on port ${PORT}`);

// Configure middleware for request handling
// CORS: Enable cross-origin requests from client app
// express.json(): Parse JSON request bodies
// express.urlencoded(): Parse URL-encoded form data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers for API endpoints
// /api/expenses: CRUD operations for expense records
// /api/upload: Excel file upload functionality
app.use('/api/expenses', expenseRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: NODE_ENV, port: PORT });
});

// Serve static files from React build directory
// IMPORTANT: Must come BEFORE catch-all route to avoid conflicts with API routes
app.use(express.static(path.join(__dirname, '../client/build')));

// Fallback to index.html for client-side routing (SPA support)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Initialize database and start server
// Database must be initialized before accepting requests
// This ensures all tables are created and ready for operations
db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1); // Exit process if database initialization fails
});
