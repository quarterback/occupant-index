# Migration Guide: Porting occupant-index Design to improved-succotash

This guide will help you replace the HTML/CSS frontend in improved-succotash with the React/TypeScript design from occupant-index, while preserving all the Python backend functionality and real data generation.

## Overview

**Goal:** Keep improved-succotash's Python backend and data generation, but replace the frontend with occupant-index's beautiful React/shadcn UI.

**Current State:**
- **improved-succotash**: Python backend + basic HTML/CSS/JS frontend
- **occupant-index**: React/TypeScript + shadcn/ui design (with sample data)

**Desired State:**
- **improved-succotash**: Python backend + React/TypeScript frontend with shadcn/ui design

---

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ and npm installed
- Python 3.10+ (for the existing backend)
- Git

---

## Step 1: Backup and Prepare

```bash
# In improved-succotash directory
cd improved-succotash
git checkout copilot/add-aminute-font-to-logo
git checkout -b copilot/migrate-react-frontend

# Backup current HTML files (optional)
mkdir -p backup
cp *.html backup/
cp styles.css backup/
cp theme.js backup/
```

---

## Step 2: Set Up React/TypeScript Project Structure

### 2.1 Copy Package Configuration

Copy these files from occupant-index to improved-succotash:

```bash
# From occupant-index, copy to improved-succotash:
package.json
package-lock.json
tsconfig.json
tsconfig.app.json
tsconfig.node.json
vite.config.ts
vitest.config.ts
tailwind.config.ts
postcss.config.js
eslint.config.js
components.json
```

### 2.2 Update package.json

In `package.json`, change the name field:
```json
{
  "name": "improved-succotash",
  "private": true,
  ...
}
```

### 2.3 Install Dependencies

```bash
npm install
```

---

## Step 3: Copy Source Code

### 3.1 Create Directory Structure

```bash
mkdir -p src/components/ui
mkdir -p src/components
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/data
mkdir -p src/test
```

### 3.2 Copy All Source Files

Copy the entire `src` directory from occupant-index to improved-succotash:

```bash
# From occupant-index directory
cp -r src/* /path/to/improved-succotash/src/

# Also copy root files
cp index.html /path/to/improved-succotash/
cp App.css /path/to/improved-succotash/src/
cp index.css /path/to/improved-succotash/src/
cp main.tsx /path/to/improved-succotash/src/
```

Key files to copy:
- `src/App.tsx` - Main app component with routing
- `src/main.tsx` - Entry point
- `src/index.css` - Global styles
- `src/App.css` - App styles
- `src/services/cpiData.ts` - Data fetching service
- `src/components/` - All components (Navigation, Footer, IndexTicker, SpreadCard, etc.)
- `src/pages/` - All pages (Index, ComputeCPI, Calculator, MarketIntel, GovBenchmarks, etc.)
- `src/components/ui/` - All shadcn/ui components

---

## Step 4: Adapt Data Service Layer

The key difference is the data structure. improved-succotash has more comprehensive data than the sample data in occupant-index.

### 4.1 Update `src/services/cpiData.ts`

The current service expects this structure:
```typescript
{
  meta: { ... },
  compute_cpi: { ticker, name, value, mom_change, ... },
  subindices: { frontier, bulk, reason, lctx, embedding },
  spreads: { cognition_premium, judgment_premium, context_premium },
  persona_cpis: { startup, agentic, throughput },
  basket_components: [ ... ],
  ...
}
```

But improved-succotash generates:
```typescript
{
  meta: { ... },
  compute_cpi: { ticker, name, value, ... },
  index_series: { launch, yoy, qtd },
  methodology_variants: { general, frontier_heavy, budget_heavy, ... },
  trend_analysis: { ... },
  subindices: { ... },
  spreads: { ... },
  market_data: { ... },
  ...
}
```

You have **two options**:

#### Option A: Update the Python Backend (Recommended)

Modify `compute_cpi.py` to output data matching occupant-index's expected structure. This means:
- Ensure `subindices` has the expected keys (frontier, bulk, reason, lctx, embedding)
- Ensure `spreads` has the expected keys (cognition_premium, judgment_premium, context_premium)
- Add `persona_cpis` section if not present
- Add `basket_components` array

#### Option B: Update the TypeScript Service

Modify `src/services/cpiData.ts` to adapt improved-succotash's data structure:

```typescript
// Map improved-succotash's methodology_variants to subindices
export async function fetchCPIData(): Promise<CPIData> {
  const response = await fetch('/data/compute-cpi.json');
  if (!response.ok) throw new Error('Failed to fetch CPI data');
  const rawData = await response.json();
  
  // Transform the data to match the expected structure
  return {
    meta: rawData.meta,
    compute_cpi: rawData.compute_cpi,
    subindices: {
      frontier: {
        ticker: rawData.methodology_variants.frontier_heavy.ticker,
        name: rawData.methodology_variants.frontier_heavy.name,
        value: rawData.methodology_variants.frontier_heavy.value,
        description: rawData.methodology_variants.frontier_heavy.description,
        mom_change: 0, // Calculate if available
        weight: 25
      },
      // Map other variants to subindices...
    },
    spreads: rawData.spreads || {},
    persona_cpis: rawData.persona_cpis || {},
    basket_components: rawData.basket_components || [],
    trend_analysis: rawData.trend_analysis,
    yield_curve: rawData.yield_curve,
    exchange_rates: rawData.exchange_rates,
  };
}
```

---

## Step 5: Update Data Path

The React app expects data at `/data/*.json` but improved-succotash has it at `/data/*.json`.

### 5.1 Update Vite Config

In `vite.config.ts`, ensure the public directory is set correctly:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Serve the data directory
  publicDir: 'public',
  // Or if data is in root, configure server:
  server: {
    fs: {
      allow: ['.'],
    },
  },
});
```

### 5.2 Option: Move Data to Public Directory

```bash
# Create public directory
mkdir -p public/data
cp -r data/* public/data/
```

Or update the fetch paths in `src/services/cpiData.ts` to point to `/data/` instead of `/public/data/`.

---

## Step 6: Update .gitignore

Add Node.js and React build artifacts to `.gitignore`:

```gitignore
# Dependencies
node_modules/
package-lock.json

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
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/

# Keep Python stuff
!venv/
!__pycache__/
```

---

## Step 7: Update HTML Entry Point

Replace the root `index.html` with the one from occupant-index. It should look like:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lovable App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Update the title and meta tags as needed.

---

## Step 8: Copy Static Assets

```bash
# Copy public assets from occupant-index
mkdir -p public
cp occupant-index/public/favicon.ico improved-succotash/public/
cp occupant-index/public/placeholder.svg improved-succotash/public/
cp occupant-index/public/robots.txt improved-succotash/public/
```

---

## Step 9: Test the Build

```bash
# Development server
npm run dev

# Should start on http://localhost:5173 or similar
# Open in browser and verify all pages load

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Step 10: Verify Data Integration

1. **Check Index Page**: Should display real CPI value from `/data/compute-cpi.json`
2. **Check ComputeCPI Page**: Should show historical data from `/data/historical.json`
3. **Check Market Intel**: Should load rankings from `/data/rankings/latest.json`
4. **Check Calculator**: Should work with model pricing data
5. **Check Gov Benchmarks**: Should display pricing tiers

---

## Step 11: Update Python Backend (if needed)

If you chose Option A above, update `compute_cpi.py` to ensure compatibility:

### Example modifications:

```python
# In compute_cpi.py, ensure the output includes:
output = {
    "meta": {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "baseline_date": "2025-01-01",
        "launch_date": "2025-01-15",
        "data_sources": ["openrouter", "litellm"],
        "methodology_version": "2.0",
        "models_count": len(models)
    },
    "compute_cpi": {
        "ticker": "$CPI",
        "name": "Compute CPI",
        "value": cpi_value,
        "mom_change": calculate_mom_change(),
        "yoy_change": calculate_yoy_change(),
        "trend": determine_trend(),
        "basket_cost": basket_cost
    },
    "subindices": {
        "frontier": {...},
        "bulk": {...},
        "reason": {...},
        "lctx": {...},
        "embedding": {...}
    },
    "spreads": {
        "cognition_premium": {...},
        "judgment_premium": {...},
        "context_premium": {...}
    },
    # ... rest of the data
}
```

---

## Step 12: Clean Up Old Files

Once verified, you can remove the old HTML files:

```bash
# Move to archive (don't delete yet)
mkdir -p archive
mv *.html archive/
mv styles.css archive/
mv theme.js archive/
```

---

## Step 13: Update README

Update `README.md` to reflect the new tech stack:

```markdown
# improved-succotash

AI Compute Pricing Index with real-time data tracking.

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Query for data fetching
- Framer Motion for animations

**Backend:**
- Python 3.10+
- Data aggregation from multiple sources
- JSON data generation

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Generate data (Python backend)
python compute_cpi.py
\`\`\`

## Data Pipeline

The Python backend generates JSON data files in `/data/`:
- `compute-cpi.json` - Main CPI data with subindices and spreads
- `historical.json` - Time series data
- `rankings/latest.json` - Model rankings and market share

The React frontend consumes these JSON files via React Query.
```

---

## Data Structure Mapping Reference

### improved-succotash → occupant-index Mapping

| improved-succotash | occupant-index | Notes |
|-------------------|----------------|-------|
| `methodology_variants.frontier_heavy` | `subindices.frontier` | Rename and restructure |
| `methodology_variants.general` | `subindices.bulk` | Map general purpose |
| `methodology_variants.budget_heavy` | `subindices.reason` | Budget tier |
| `index_series.launch` | `compute_cpi` | Main headline index |
| `trend_analysis` | `trend_analysis` | Keep as-is |
| `market_data` | `exchange_rates` | Market intelligence |
| `spreads` | `spreads` | Keep structure |

---

## Common Issues and Solutions

### Issue 1: "Failed to fetch CPI data"
**Solution:** Check that:
- Data files exist in the correct location (`public/data/` or `/data/`)
- Paths in `cpiData.ts` match the actual file locations
- Dev server is serving static files correctly

### Issue 2: Data structure mismatches
**Solution:** 
- Use browser DevTools Network tab to inspect the actual JSON response
- Update TypeScript interfaces in `cpiData.ts` to match
- Add data transformation logic as shown in Step 4

### Issue 3: Build errors with shadcn components
**Solution:**
- Ensure all peer dependencies are installed: `npm install`
- Check that `components.json` is present
- Verify `tailwind.config.ts` includes the content paths

### Issue 4: Routing issues (404 on refresh)
**Solution:**
- For development: Vite handles this automatically
- For production: Configure your server to serve `index.html` for all routes
- Or use hash routing instead of browser routing

---

## Deployment Considerations

### Option A: Static Site (Recommended)

```bash
# Build the frontend
npm run build

# This creates a `dist/` directory with static files
# Serve with any static hosting (Netlify, Vercel, GitHub Pages, etc.)
```

The Python backend runs separately to generate data, which is then committed to the repo or uploaded to the hosting.

### Option B: Integrated Server

Use a simple Python server to serve both the React build and handle data generation:

```python
# server.py
from flask import Flask, send_from_directory
import subprocess

app = Flask(__name__, static_folder='dist')

@app.route('/')
def serve_index():
    return send_from_directory('dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('dist', path)

@app.route('/api/regenerate', methods=['POST'])
def regenerate_data():
    subprocess.run(['python', 'compute_cpi.py'])
    return {'status': 'success'}

if __name__ == '__main__':
    app.run(port=5000)
```

---

## Testing Checklist

Before finalizing the migration:

- [ ] All pages load without errors
- [ ] Data fetches successfully from JSON files
- [ ] Navigation works between all routes
- [ ] Index page shows real CPI data
- [ ] ComputeCPI page displays historical charts
- [ ] Calculator page interactive controls work
- [ ] Market Intel shows rankings and market data
- [ ] Gov Benchmarks displays pricing tiers
- [ ] Loading states appear correctly
- [ ] Error states handle missing data gracefully
- [ ] Mobile responsive design works
- [ ] Dark/light theme toggle (if implemented)
- [ ] Build completes without errors
- [ ] Production build preview works

---

## Rollback Plan

If something goes wrong:

```bash
# Restore from backup
git checkout copilot/add-aminute-font-to-logo
cp backup/*.html .
cp backup/styles.css .
cp backup/theme.js .

# Or create a new branch from the backup
git checkout -b rollback-react-migration copilot/add-aminute-font-to-logo
```

---

## Next Steps After Migration

1. **Data Pipeline Integration**: Set up automated data generation (cron jobs, GitHub Actions)
2. **API Endpoints**: Optionally add API endpoints for real-time data updates
3. **Analytics**: Add analytics tracking
4. **SEO**: Update meta tags, add sitemap
5. **Performance**: Optimize bundle size, lazy load routes
6. **Testing**: Add unit tests and E2E tests
7. **Documentation**: Update API docs and user guides

---

## File Checklist

Files to copy from occupant-index to improved-succotash:

**Root Level:**
- [ ] `package.json` (update name)
- [ ] `package-lock.json`
- [ ] `tsconfig.json`
- [ ] `tsconfig.app.json`
- [ ] `tsconfig.node.json`
- [ ] `vite.config.ts`
- [ ] `vitest.config.ts`
- [ ] `tailwind.config.ts`
- [ ] `postcss.config.js`
- [ ] `eslint.config.js`
- [ ] `components.json`
- [ ] `index.html`

**Source Directory:**
- [ ] `src/App.tsx`
- [ ] `src/main.tsx`
- [ ] `src/App.css`
- [ ] `src/index.css`
- [ ] `src/vite-env.d.ts`

**Services:**
- [ ] `src/services/cpiData.ts`

**Components:**
- [ ] `src/components/Navigation.tsx`
- [ ] `src/components/Footer.tsx`
- [ ] `src/components/SectionHeader.tsx`
- [ ] `src/components/IndexTicker.tsx`
- [ ] `src/components/SpreadCard.tsx`
- [ ] `src/components/MemoCard.tsx`
- [ ] `src/components/NavLink.tsx`
- [ ] All `src/components/ui/*` components (40+ files)

**Pages:**
- [ ] `src/pages/Index.tsx`
- [ ] `src/pages/ComputeCPI.tsx`
- [ ] `src/pages/Methodology.tsx`
- [ ] `src/pages/MarketIntel.tsx`
- [ ] `src/pages/Calculator.tsx`
- [ ] `src/pages/GovBenchmarks.tsx`
- [ ] `src/pages/Memos.tsx`
- [ ] `src/pages/MemoDetail.tsx`
- [ ] `src/pages/Work.tsx`
- [ ] `src/pages/About.tsx`
- [ ] `src/pages/Contact.tsx`
- [ ] `src/pages/NotFound.tsx`

**Utilities:**
- [ ] `src/lib/utils.ts`
- [ ] `src/hooks/use-toast.ts`
- [ ] `src/hooks/use-mobile.tsx`
- [ ] `src/data/memos.ts` (if using static memo data)

**Public Assets:**
- [ ] `public/favicon.ico`
- [ ] `public/placeholder.svg`
- [ ] `public/robots.txt`

---

## Support

If you encounter issues during migration:
1. Check the browser console for errors
2. Verify data file paths and structure
3. Compare against working occupant-index implementation
4. Check that all dependencies installed correctly: `npm ci`
5. Try clearing node_modules and reinstalling: `rm -rf node_modules && npm install`

---

## Summary

This migration replaces improved-succotash's HTML/CSS frontend with occupant-index's React/TypeScript frontend while keeping all the Python data generation intact. The key is ensuring data compatibility between what the Python backend generates and what the React frontend expects.

**Time Estimate:** 2-4 hours for basic migration, additional time for data structure alignment and testing.

**Difficulty:** Moderate (requires understanding of both React and data structures)

**Risk:** Low (easy to rollback, Python backend unchanged)
