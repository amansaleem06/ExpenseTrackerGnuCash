# Expense Tracker Web Application

A modern, full-stack expense tracking web application built for small businesses. Import from Excel, track expenses, view summaries, and export to CSV for GnuCash integration.

## Features

- 📊 **Dashboard** - Overview of expenses with summary cards
- ➕ **Add/Edit Expenses** - Easy expense entry with validation
- 📋 **Expense List** - View and manage all expenses
- 📈 **Summary Reports** - View expenses by type and account
- 📤 **Excel Import** - Upload Excel files to import expenses
- 💾 **CSV Export** - Export expenses in GnuCash-compatible format

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Styling**: CSS3 with modern gradients

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Create data directory:**
   ```bash
   mkdir data
   mkdir uploads
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend React app on http://localhost:3000

## Usage

1. **Add Expenses**: Click "Add Expense" tab and fill in the form
2. **View Dashboard**: See summary cards and recent expenses
3. **View All Expenses**: Click "Expenses" tab to see full list
4. **View Summary**: Click "Summary" tab for detailed breakdowns
5. **Upload Excel**: Click "Upload Excel" to import from Excel files
6. **Export CSV**: Click "Export CSV" to download GnuCash-compatible file

## Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 2: Deploy to Railway

1. **Connect your GitHub repository** to Railway
2. **Set build command:** `npm run install-all && npm run build`
3. **Set start command:** `npm start`
4. **Set PORT** environment variable (Railway sets this automatically)

### Option 3: Deploy to Render

1. **Create new Web Service** on Render
2. **Connect your repository**
3. **Build Command:** `npm run install-all && npm run build`
4. **Start Command:** `npm start`
5. **Environment:** Node

### Option 4: Deploy to Vercel/Netlify (Frontend) + Railway/Render (Backend)

**Backend:**
- Deploy backend separately to Railway/Render
- Set `REACT_APP_API_URL` in frontend to your backend URL

**Frontend:**
- Deploy React app to Vercel or Netlify
- Set environment variable `REACT_APP_API_URL` to your backend URL

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000/api
```

For production, set `REACT_APP_API_URL` to your deployed backend URL.

## Database

The application uses SQLite database stored in `data/expenses.db`. The database is automatically created on first run with the following tables:

- `expenses` - Stores all expense records
- `expense_types` - Stores expense type mappings for GnuCash

## API Endpoints

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary/by-type` - Get summary by expense type
- `GET /api/expenses/summary/by-account` - Get summary by account
- `GET /api/expenses/summary/total` - Get grand total
- `GET /api/expenses/export/gnucash` - Export to CSV
- `POST /api/upload/excel` - Upload Excel file

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
