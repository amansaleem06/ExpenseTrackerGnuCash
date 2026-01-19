# How to Push to GitHub - Simple Instructions

## 📍 Where to Run the Script

The `push_to_github.bat` file is in your project folder:
```
C:\Users\Lenovo\OneDrive\Desktop\ExpenseTrackerGnuCash
```

## ✅ Step-by-Step Instructions

### Step 1: Create GitHub Repository First!

**IMPORTANT:** You must create the repository on GitHub BEFORE running the script.

1. Go to: **https://github.com/new**
2. Repository name: `ExpenseTrackerGnuCash`
3. Description: `Expense Tracker Web Application for Small Business`
4. Choose Public or Private
5. **DO NOT** check any boxes (no README, .gitignore, or license)
6. Click **"Create repository"**

### Step 2: Run the Script

You have 3 easy ways to run `push_to_github.bat`:

#### Option 1: Double-Click (Easiest!)
1. Open File Explorer
2. Navigate to: `C:\Users\Lenovo\OneDrive\Desktop\ExpenseTrackerGnuCash`
3. Find `push_to_github.bat`
4. **Double-click it**
5. A window will open and push your code automatically

#### Option 2: From PowerShell (Current Window)
1. Make sure you're in the project folder
2. Type: `.\push_to_github.bat`
3. Press Enter

#### Option 3: From Command Prompt
1. Open Command Prompt (CMD)
2. Navigate to the folder:
   ```
   cd C:\Users\Lenovo\OneDrive\Desktop\ExpenseTrackerGnuCash
   ```
3. Type: `push_to_github.bat`
4. Press Enter

## 🎉 After Running

The script will:
- Add the GitHub remote
- Push all your code
- Show you the repository URL

Your code will be live at:
**https://github.com/amansaleem06/ExpenseTrackerGnuCash**

## ❓ Troubleshooting

### If you get "repository not found" error:
- Make sure you created the repository on GitHub first (Step 1)
- Check the repository name matches exactly: `ExpenseTrackerGnuCash`

### If you get authentication error:
- GitHub may ask for your username and password
- Use your GitHub username: `amansaleem06`
- For password, use a **Personal Access Token** (not your regular password)
  - Get token at: https://github.com/settings/tokens
  - Generate new token (classic) with `repo` scope

### If the script doesn't run:
- Right-click `push_to_github.bat`
- Select "Run as administrator"

---

**That's it!** Just create the repo, then double-click the batch file! 🚀
