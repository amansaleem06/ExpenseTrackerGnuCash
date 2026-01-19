# Project Structure

```
ExpenseTrackerGnuCash/
│
├── client/                 # React frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── ExpenseForm.js
│   │   │   ├── ExpenseList.js
│   │   │   ├── Summary.js
│   │   │   └── ExcelUpload.js
│   │   ├── App.js         # Main app component
│   │   ├── App.css        # App styles
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
│
├── server/                 # Node.js backend
│   ├── database/
│   │   └── db.js          # Database setup and connection
│   ├── routes/
│   │   ├── expenses.js    # Expense CRUD routes
│   │   └── upload.js      # Excel upload route
│   └── index.js           # Express server setup
│
├── data/                   # SQLite database storage
│   └── expenses.db        # Created automatically
│
├── uploads/                # Temporary Excel file storage
│
├── package.json           # Root package.json with scripts
├── Procfile              # Heroku deployment config
├── README.md             # Main documentation
├── DEPLOYMENT.md         # Deployment guide
├── QUICKSTART.md         # Quick start guide
└── .gitignore           # Git ignore rules
```

## Key Files

### Backend
- `server/index.js` - Express server and route setup
- `server/database/db.js` - SQLite database initialization
- `server/routes/expenses.js` - All expense-related API endpoints
- `server/routes/upload.js` - Excel file upload handling

### Frontend
- `client/src/App.js` - Main application component with routing
- `client/src/components/Dashboard.js` - Dashboard with summary cards
- `client/src/components/ExpenseForm.js` - Add/edit expense form
- `client/src/components/ExpenseList.js` - Table view of expenses
- `client/src/components/Summary.js` - Summary reports
- `client/src/components/ExcelUpload.js` - Excel import component

## Database Schema

### expenses table
- `id` - Primary key
- `date` - Expense date
- `description` - Expense description
- `amount` - Expense amount
- `account` - Account type (Cash/Card)
- `expense_type` - Category/type of expense
- `created_at` - Timestamp

### expense_types table
- `id` - Primary key
- `name` - Expense type name
- `transfer_account` - GnuCash account mapping
- `created_at` - Timestamp

## API Endpoints

All endpoints are prefixed with `/api`

### Expenses
- `GET /expenses` - Get all expenses
- `GET /expenses/:id` - Get single expense
- `POST /expenses` - Create expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense

### Summary
- `GET /expenses/summary/by-type` - Summary by expense type
- `GET /expenses/summary/by-account` - Summary by account
- `GET /expenses/summary/total` - Grand total

### Export & Types
- `GET /expenses/export/gnucash` - Export to CSV
- `GET /expenses/types/list` - Get expense types
- `POST /expenses/types` - Add expense type

### Upload
- `POST /upload/excel` - Upload Excel file
