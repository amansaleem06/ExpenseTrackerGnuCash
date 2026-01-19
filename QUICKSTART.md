# Quick Start Guide

Get your Expense Tracker up and running in 5 minutes!

## Local Development

### Step 1: Install Dependencies

```bash
npm run install-all
```

This installs dependencies for both frontend and backend.

### Step 2: Start the Application

```bash
npm run dev
```

This starts:
- **Backend** on http://localhost:5000
- **Frontend** on http://localhost:3000

### Step 3: Open Your Browser

Visit http://localhost:3000 and start tracking expenses!

## First Time Setup

1. **Add Your First Expense:**
   - Click "Add Expense" tab
   - Fill in the form (Date, Description, Amount, Account, Expense Type)
   - Click "Add Expense"

2. **View Dashboard:**
   - See summary cards showing totals
   - View recent expenses

3. **Import from Excel (Optional):**
   - Click "Upload Excel" tab
   - Select your Excel file
   - Click "Upload File"

4. **Export to CSV:**
   - Click "Export CSV" button
   - Download the GnuCash-compatible file

## Production Build

To build for production:

```bash
npm run build
npm start
```

The app will be available on http://localhost:5000

## Troubleshooting

### Port Already in Use

If port 5000 or 3000 is already in use:

1. **Change backend port:**
   - Create `.env` file: `PORT=5001`
   - Update `client/src/App.js`: Change `API_URL` to `http://localhost:5001/api`

2. **Change frontend port:**
   - Set `PORT=3001` before running `npm run dev`

### Database Issues

- The database is created automatically in `data/expenses.db`
- If you see database errors, delete `data/expenses.db` and restart

### Module Not Found

Run `npm run install-all` again to ensure all dependencies are installed.

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy online
- Customize expense types in the database
- Add more features as needed!

Happy tracking! 💰
