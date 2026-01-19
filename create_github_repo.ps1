# Script to create GitHub repository and push code
# You'll need a GitHub Personal Access Token

param(
    [string]$Token = "",
    [string]$RepoName = "ExpenseTrackerGnuCash",
    [string]$Username = "amansaleem06"
)

if ($Token -eq "") {
    Write-Host "GitHub Personal Access Token is required!"
    Write-Host ""
    Write-Host "To create a token:"
    Write-Host "1. Go to https://github.com/settings/tokens"
    Write-Host "2. Click 'Generate new token (classic)'"
    Write-Host "3. Give it a name and select 'repo' scope"
    Write-Host "4. Copy the token"
    Write-Host ""
    Write-Host "Then run: .\create_github_repo.ps1 -Token YOUR_TOKEN"
    exit
}

$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
}

$body = @{
    name = $RepoName
    description = "Expense Tracker Web Application for Small Business"
    private = $false
} | ConvertTo-Json

try {
    Write-Host "Creating repository $RepoName on GitHub..."
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "Repository created successfully!"
    Write-Host "URL: $($response.html_url)"
    
    # Add remote and push
    Write-Host ""
    Write-Host "Adding remote and pushing code..."
    git remote add origin "https://github.com/$Username/$RepoName.git"
    git push -u origin main
    
    Write-Host ""
    Write-Host "Done! Your code is now on GitHub: $($response.html_url)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "If repository already exists, you can manually add remote:"
    Write-Host "git remote add origin https://github.com/$Username/$RepoName.git"
    Write-Host "git push -u origin main"
}
