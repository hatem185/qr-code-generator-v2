#!/bin/bash

# Migration Script: Replace Vanilla JS with Svelte
# This script safely migrates the Svelte version to the main directory
# while preserving Git history

echo "==================================="
echo "QR Code Generator - Svelte Migration"
echo "==================================="
echo ""

# Check if we're in the right directory
if [ ! -d "svelte-migration" ]; then
    echo "Error: svelte-migration directory not found!"
    echo "Please run this script from the project root."
    exit 1
fi

if [ ! -d ".git" ]; then
    echo "Error: .git directory not found!"
    echo "Please run this script from the project root."
    exit 1
fi

echo "Step 1: Creating backup..."
BACKUP_DIR="backup-vanilla-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup old files (excluding .git and svelte-migration)
echo "Backing up original files to $BACKUP_DIR..."
rsync -av --exclude='.git' --exclude='svelte-migration' --exclude="$BACKUP_DIR" --exclude='node_modules' ./ "$BACKUP_DIR/" 2>/dev/null

echo ""
echo "Step 2: Removing old source files..."
# Remove old source files but keep .git, .gitignore, and README.md
rm -rf css/
rm -rf js/
rm -rf imgs/
rm -f index.html

echo ""
echo "Step 3: Moving Svelte files to main directory..."
# Copy all Svelte migration files to root
cp -r svelte-migration/* .
cp svelte-migration/.gitignore .gitignore

echo ""
echo "Step 4: Creating public/imgs directory and copying assets..."
mkdir -p public/imgs
if [ -f "$BACKUP_DIR/imgs/ds-logo.png" ]; then
    cp "$BACKUP_DIR/imgs/ds-logo.png" public/imgs/
    echo "✓ Logo copied to public/imgs/"
else
    echo "⚠ Warning: ds-logo.png not found in backup. Please copy manually."
fi

echo ""
echo "Step 5: Cleaning up..."
rm -rf svelte-migration/

echo ""
echo "Step 6: Updating .gitignore..."
# Ensure .gitignore has node_modules and dist
if ! grep -q "node_modules" .gitignore; then
    echo "node_modules" >> .gitignore
fi
if ! grep -q "dist" .gitignore; then
    echo "dist" >> .gitignore
fi
if ! grep -q "dist-ssr" .gitignore; then
    echo "dist-ssr" >> .gitignore
fi

echo ""
echo "==================================="
echo "✓ Migration Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Run development server: npm run dev"
echo "3. Test the application"
echo "4. Review changes: git status"
echo "5. Commit changes: git add . && git commit -m 'Migrate to Svelte'"
echo ""
echo "Your original files are backed up in: $BACKUP_DIR"
echo "You can delete this backup after verifying everything works."
echo ""

