---
description: Deploy updates to GitHub Pages
---

# Deploy to GitHub Pages

Use this workflow to push your local changes to GitHub and deploy them to GitHub Pages.

## Steps

1. **Stage all changes**
   ```powershell
   & 'C:\Program Files\Git\cmd\git.exe' add .
   ```

// turbo
2. **Commit changes**
   ```powershell
   & 'C:\Program Files\Git\cmd\git.exe' commit -m "Your commit message here"
   ```

// turbo
3. **Push to GitHub**
   ```powershell
   & 'C:\Program Files\Git\cmd\git.exe' push
   ```

4. **Your changes will be live at**: https://duncanmama.github.io/coffee-projekt/
   
   Note: GitHub Pages may take a few minutes to build and deploy your changes.
