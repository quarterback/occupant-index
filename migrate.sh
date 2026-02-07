#!/bin/bash
# Quick Migration Script
# This script helps copy files from occupant-index to improved-succotash
# Usage: ./migrate.sh /path/to/occupant-index /path/to/improved-succotash

set -e

OCCUPANT_INDEX="$1"
IMPROVED_SUCCOTASH="$2"

if [ -z "$OCCUPANT_INDEX" ] || [ -z "$IMPROVED_SUCCOTASH" ]; then
    echo "Usage: $0 <path-to-occupant-index> <path-to-improved-succotash>"
    exit 1
fi

echo "🚀 Starting migration from occupant-index to improved-succotash..."

# Backup current HTML files in improved-succotash
echo "📦 Creating backup..."
cd "$IMPROVED_SUCCOTASH"
mkdir -p backup
cp -f *.html backup/ 2>/dev/null || true
cp -f styles.css backup/ 2>/dev/null || true
cp -f theme.js backup/ 2>/dev/null || true

# Copy configuration files
echo "⚙️  Copying configuration files..."
cp "$OCCUPANT_INDEX/package.json" .
cp "$OCCUPANT_INDEX/package-lock.json" .
cp "$OCCUPANT_INDEX/tsconfig.json" .
cp "$OCCUPANT_INDEX/tsconfig.app.json" .
cp "$OCCUPANT_INDEX/tsconfig.node.json" .
cp "$OCCUPANT_INDEX/vite.config.ts" .
cp "$OCCUPANT_INDEX/vitest.config.ts" .
cp "$OCCUPANT_INDEX/tailwind.config.ts" .
cp "$OCCUPANT_INDEX/postcss.config.js" .
cp "$OCCUPANT_INDEX/eslint.config.js" .
cp "$OCCUPANT_INDEX/components.json" .
cp "$OCCUPANT_INDEX/index.html" .

# Update package.json name
echo "📝 Updating package.json name..."
sed -i 's/"name": "vite_react_shadcn_ts"/"name": "improved-succotash"/' package.json

# Copy source directory
echo "📂 Copying source files..."
rm -rf src
cp -r "$OCCUPANT_INDEX/src" .

# Copy public assets
echo "🎨 Copying public assets..."
mkdir -p public
cp -r "$OCCUPANT_INDEX/public/"* public/ 2>/dev/null || true

# Move data to public if it exists
if [ -d "data" ]; then
    echo "🔄 Moving data directory to public..."
    cp -r data public/
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📄 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Development
.DS_Store
*.local
*.log

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# Testing
coverage/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
EOF
fi

echo "📦 Installing dependencies..."
npm install

echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Review the changes with: git status"
echo "2. Test the dev server: npm run dev"
echo "3. Update data paths in src/services/cpiData.ts if needed"
echo "4. Build for production: npm run build"
echo ""
echo "To rollback, restore from backup/ directory"
