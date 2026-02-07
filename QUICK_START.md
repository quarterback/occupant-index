# Quick Start: Migrating to React Frontend

This is a condensed version of MIGRATION_GUIDE.md for quick reference.

## Prerequisites
- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Both repositories cloned locally

## Quick Migration (Using Script)

```bash
# 1. Make the script executable (if not already)
chmod +x migrate.sh

# 2. Run the migration script
./migrate.sh /path/to/occupant-index /path/to/improved-succotash

# 3. Navigate to improved-succotash
cd /path/to/improved-succotash

# 4. Test the development server
npm run dev

# 5. Open http://localhost:5173 in your browser
```

## Manual Migration (Step by Step)

### 1. Backup (in improved-succotash)
```bash
mkdir -p backup
cp *.html backup/
cp styles.css backup/
cp theme.js backup/
```

### 2. Copy Configuration Files
From occupant-index to improved-succotash:
```bash
package.json
package-lock.json
tsconfig*.json
vite.config.ts
tailwind.config.ts
postcss.config.js
eslint.config.js
components.json
index.html
```

### 3. Copy Source Directory
```bash
cp -r /path/to/occupant-index/src /path/to/improved-succotash/
```

### 4. Copy Public Assets
```bash
mkdir -p public
cp -r /path/to/occupant-index/public/* public/
```

### 5. Update Data Path
Ensure data is accessible at `/data/` or `/public/data/`:
```bash
# Option A: Copy to public
cp -r data public/

# Option B: Update paths in src/services/cpiData.ts
```

### 6. Install Dependencies
```bash
npm install
```

### 7. Update package.json Name
```json
{
  "name": "improved-succotash",
  ...
}
```

### 8. Test
```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

## Data Structure Alignment

### Option 1: Update Python Backend (Recommended)
Modify `compute_cpi.py` to output the expected structure with:
- `subindices.frontier`, `subindices.bulk`, `subindices.reason`
- `spreads.cognition_premium`, `spreads.judgment_premium`
- `persona_cpis.startup`, `persona_cpis.agentic`

### Option 2: Use Data Adapter
Copy `DATA_ADAPTER_EXAMPLE.ts` into `src/services/` and use it to transform the data:

```typescript
// In src/services/cpiData.ts
import { adaptImprovedSuccotashData } from './dataAdapter';

export async function fetchCPIData(): Promise<CPIData> {
  const response = await fetch('/data/compute-cpi.json');
  if (!response.ok) throw new Error('Failed to fetch CPI data');
  const rawData = await response.json();
  return adaptImprovedSuccotashData(rawData);
}
```

## Testing Checklist

- [ ] Index page loads and shows real CPI value
- [ ] ComputeCPI page displays historical data
- [ ] Calculator page interactive controls work
- [ ] Market Intel shows rankings
- [ ] Gov Benchmarks displays pricing tiers
- [ ] Navigation works between all routes
- [ ] No console errors
- [ ] Production build works (`npm run build`)

## Common Issues

### "Failed to fetch CPI data"
- Check data file location (should be in `public/data/` or served at `/data/`)
- Verify paths in `src/services/cpiData.ts`

### TypeScript errors
- Run `npm install` again
- Check that all `tsconfig*.json` files are copied

### Styling issues
- Verify `tailwind.config.ts` is present
- Check `postcss.config.js` is in root
- Ensure `index.css` is imported in `main.tsx`

## Rollback

If something goes wrong:
```bash
# Restore from backup
cp backup/*.html .
cp backup/styles.css .
cp backup/theme.js .

# Or use git
git checkout copilot/add-aminute-font-to-logo
```

## File Count Reference

You should copy approximately:
- 15 config files (root level)
- 5 main source files (src root)
- 1 service file
- 40+ UI components
- 12 page components
- 3+ utility files
- 3+ public assets

**Total: ~80 files**

## Time Estimate

- Using automated script: **15-30 minutes**
- Manual migration: **2-4 hours**
- Data alignment: **1-2 hours**
- Testing: **1-2 hours**

## Next Steps After Migration

1. **Test thoroughly** - Check all pages and features
2. **Update README** - Document the new tech stack
3. **Update .gitignore** - Add node_modules/, dist/, etc.
4. **Commit changes** - Create a new branch first
5. **Deploy** - Build and deploy the new frontend

## Getting Help

1. Check MIGRATION_GUIDE.md for detailed instructions
2. Review DATA_ADAPTER_EXAMPLE.ts for data structure info
3. Compare working occupant-index for reference
4. Check browser console for specific errors

---

**Pro Tip:** Use the automated script first, then manually adjust any data structure issues. This is faster than doing everything manually.
