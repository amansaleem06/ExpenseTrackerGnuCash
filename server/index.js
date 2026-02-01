const express = require('express');
const cors = require('cors');
const path = require('path');
const expenseRoutes = require('./routes/expenses');
const uploadRoutes = require('./routes/upload');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`Starting in ${NODE_ENV} mode on port ${PORT}`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: NODE_ENV, port: PORT });
});

// Serve static files from React app in production
if (NODE_ENV === 'production') {
  console.log('Serving static files from client/build');
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} else {
  console.log('Development mode - not serving React build');
}

// Initialize database
db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
