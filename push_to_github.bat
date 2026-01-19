@echo off
echo ========================================
echo Pushing Expense Tracker to GitHub
echo ========================================
echo.

REM Add remote (if not already added)
git remote remove origin 2>nul
git remote add origin https://github.com/amansaleem06/ExpenseTrackerGnuCash.git

echo.
echo Pushing code to GitHub...
git push -u origin main

echo.
echo ========================================
echo Done! Check your GitHub repository:
echo https://github.com/amansaleem06/ExpenseTrackerGnuCash
echo ========================================
pause
