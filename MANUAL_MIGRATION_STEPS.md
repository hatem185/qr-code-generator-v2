# Manual Migration Steps: Vanilla JS → Svelte

This guide shows you how to replace the main project with the Svelte version while keeping Git history.

## Option 1: Automated Script (Recommended)

### Step 1: Make script executable
```bash
cd /Users/hash/WebstormProjects/ds_qr_code_generator
chmod +x MIGRATE_TO_SVELTE.sh
```

### Step 2: Run the migration script
```bash
./MIGRATE_TO_SVELTE.sh
```

### Step 3: Install dependencies
```bash
npm install
```

### Step 4: Test the application
```bash
npm run dev
```

### Step 5: Commit changes
```bash
git status
git add .
git commit -m "Migrate from Vanilla JS to Svelte"
```

---

## Option 2: Manual Migration

If you prefer to do it manually, follow these steps:

### Step 1: Create a backup
```bash
cd /Users/hash/WebstormProjects/ds_qr_code_generator

# Create backup folder
mkdir backup-vanilla-$(date +%Y%m%d_%H%M%S)

# Copy current files (except .git and svelte-migration)
rsync -av --exclude='.git' --exclude='svelte-migration' --exclude='node_modules' ./ backup-vanilla-*/
```

### Step 2: Remove old source files
```bash
# Remove vanilla JS files
rm -rf css/
rm -rf js/
rm -f index.html

# Keep these files:
# - .git/ (Git repository)
# - README.md (can be updated)
# - imgs/ds-logo.png (will be moved)
```

### Step 3: Move Svelte files to root
```bash
# Copy all Svelte files to root
cp -r svelte-migration/* .

# Copy .gitignore
cp svelte-migration/.gitignore .gitignore
```

### Step 4: Move assets
```bash
# Create public/imgs directory
mkdir -p public/imgs

# Move logo
cp imgs/ds-logo.png public/imgs/

# Remove old imgs folder
rm -rf imgs/
```

### Step 5: Clean up
```bash
# Remove the svelte-migration folder
rm -rf svelte-migration/

# Remove migration scripts (optional)
rm MIGRATE_TO_SVELTE.sh
rm MANUAL_MIGRATION_STEPS.md
```

### Step 6: Install dependencies
```bash
npm install
```

### Step 7: Test the application
```bash
npm run dev
```

Open http://localhost:5173 and verify everything works.

### Step 8: Update README (optional)
```bash
# Edit README.md to reflect Svelte stack
# Update installation and running instructions
```

### Step 9: Commit to Git
```bash
# Check what changed
git status

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Migrate to Svelte framework

- Replaced vanilla JavaScript with Svelte
- Improved code organization with components
- Added build system with Vite
- Maintained all original functionality
- Updated dependencies and project structure"
```

---

## File Structure Comparison

### Before (Vanilla JS)
```
ds_qr_code_generator/
├── .git/
├── css/
│   └── style.css
├── imgs/
│   └── ds-logo.png
├── js/
│   ├── qrcode.min.js
│   └── script.js
├── index.html
└── README.md
```

### After (Svelte)
```
ds_qr_code_generator/
├── .git/                    # ✓ Preserved
├── public/
│   └── imgs/
│       └── ds-logo.png     # Moved from /imgs/
├── src/
│   ├── lib/
│   │   ├── components/     # New: Svelte components
│   │   ├── api.js
│   │   ├── constants.js
│   │   ├── qrGenerator.js
│   │   └── utils.js
│   ├── stores.js           # New: State management
│   ├── App.svelte          # New: Main component
│   ├── main.js
│   └── app.css
├── index.html              # Replaced
├── package.json            # New
├── vite.config.js          # New
├── svelte.config.js        # New
├── .gitignore              # Updated
└── README.md               # Should be updated
```

---

## What Gets Preserved

✅ **Preserved:**
- `.git/` directory (entire Git history)
- All commit history
- All branches
- Remote repository settings
- `.gitignore` (updated for Svelte/Node)

✅ **Backed Up:**
- All original files in `backup-vanilla-*/` folder

---

## What Gets Replaced

🔄 **Replaced:**
- `index.html` - New Svelte template
- `css/style.css` - Now `src/app.css` + component styles
- `js/script.js` - Now multiple organized files in `src/`
- `js/qrcode.min.js` - Now npm package

🗑️ **Removed:**
- `css/` directory
- `js/` directory
- Old `index.html`

---

## Post-Migration Checklist

After migration, verify these items:

### 1. Git Status
```bash
git status
# Should show modified/deleted old files and new Svelte files
```

### 2. Dependencies Installed
```bash
npm list
# Should show svelte, vite, qrcode packages
```

### 3. Development Server
```bash
npm run dev
# Should start on http://localhost:5173
```

### 4. Application Features
- [ ] Generate Orders QR codes
- [ ] Generate Box QR codes with layout options
- [ ] Generate Custom QR codes with prefix/suffix
- [ ] Online/Offline mode toggle
- [ ] History list displays
- [ ] Click history to regenerate
- [ ] Latest code button works
- [ ] Print layouts work correctly
- [ ] All 3 QR types print properly

### 5. Print Testing
- [ ] Orders: 3×2 grid, 6 per page
- [ ] Box Grid: 3×2 grid, 6 per page
- [ ] Box Single: 1 per page, no clipping
- [ ] Custom Grid: 3×2 grid, 6 per page
- [ ] Custom Single: 1 per page, no clipping

### 6. Build for Production
```bash
npm run build
# Should create dist/ folder without errors
```

---

## Rollback (If Needed)

If something goes wrong, you can rollback:

### Option 1: From backup
```bash
# Remove all files except .git
rm -rf src/ public/ package.json vite.config.js svelte.config.js index.html

# Restore from backup
cp -r backup-vanilla-*/* .

# Restore node_modules if needed
rm -rf node_modules
```

### Option 2: From Git
```bash
# Reset to last commit (if not committed yet)
git reset --hard HEAD

# Or restore specific files
git checkout HEAD -- .
```

---

## Troubleshooting

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Module not found" errors
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 already in use
**Solution:**
```bash
npm run dev -- --port 3000
```

### Issue: Assets not loading
**Solution:**
```bash
# Verify logo exists
ls public/imgs/ds-logo.png

# If not, copy from backup
cp backup-vanilla-*/imgs/ds-logo.png public/imgs/
```

### Issue: Git shows too many changes
**Solution:** This is normal. You're replacing the entire codebase.
```bash
# Review changes by file type
git status | grep deleted
git status | grep modified
git status | grep "new file"
```

---

## Git Commit Best Practices

### Recommended Commit Message
```bash
git commit -m "Migrate to Svelte framework

Breaking Changes:
- Complete rewrite using Svelte + Vite
- New project structure with components
- Updated build system and dependencies

Features Preserved:
- All 3 QR code types (Orders, Box, Custom)
- Online/Offline mode
- History management
- Print layouts (grid and single)
- API integration
- LocalStorage persistence

Technical Changes:
- Vanilla JS → Svelte 4
- Manual DOM → Reactive components  
- Global state → Svelte stores
- CSS file → App.css + scoped styles
- No build → Vite build system

Migration completed on $(date +%Y-%m-%d)"
```

### Create Migration Tag
```bash
# Tag the migration for easy reference
git tag -a v2.0.0-svelte -m "Svelte migration"

# Push tag to remote
git push origin v2.0.0-svelte
```

---

## Remote Repository

After migration, push to remote:

```bash
# Check remote
git remote -v

# Push changes
git push origin main

# Or push all branches
git push --all origin
```

**Note:** If you have team members, notify them about the migration as they'll need to:
1. Pull latest changes
2. Run `npm install`
3. Use new npm scripts (`npm run dev` instead of opening HTML)

---

## Documentation Updates

After migration, update these files:

### README.md
- Change installation instructions to include `npm install`
- Update running instructions to `npm run dev`
- Add build instructions: `npm run build`
- Update technology stack section
- Add new project structure

### .env (if needed)
```bash
# Create .env for local configuration
touch .env
echo "VITE_API_URL=your-api-url" >> .env
```

Remember: `.env` is already in `.gitignore`

---

## Success Criteria

Migration is successful when:

✅ Git history preserved  
✅ `npm run dev` starts successfully  
✅ All features work identically to original  
✅ Print layouts work correctly  
✅ No console errors  
✅ `npm run build` completes successfully  
✅ Tests pass (if any)  
✅ Team members can run the app  

---

## Support Files

After migration, these files can be deleted:
- `backup-vanilla-*/` (after verification)
- `MIGRATE_TO_SVELTE.sh`
- `MANUAL_MIGRATION_STEPS.md`
- `MIGRATION_GUIDE.md` (or keep for reference)
- `PRINT_FIX.md` (or keep for reference)
- `SETUP_INSTRUCTIONS.md` (or keep for reference)

