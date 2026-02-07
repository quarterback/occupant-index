# Migration Documentation Summary

This directory contains three documents to help you port the occupant-index React design to improved-succotash.

## Documents

### 1. QUICK_START.md
**Start here** for a condensed quick reference guide.
- Prerequisites checklist
- Automated script usage
- Manual step-by-step
- Testing checklist
- Common issues and solutions
- Time: 15-30 minutes with script

### 2. MIGRATION_GUIDE.md
**Complete reference** with detailed instructions.
- Full step-by-step migration process
- Data structure mapping
- Python backend integration options
- Deployment considerations
- Troubleshooting guide
- 60+ item file checklist
- Time: 2-4 hours manual

### 3. DATA_ADAPTER_EXAMPLE.ts
**Code example** for data structure adaptation.
- Shows how to transform improved-succotash data
- Maps methodology_variants to subindices
- Creates persona CPIs
- Ready to copy into your project

### 4. migrate.sh
**Automated script** to copy files.
- One command migration
- Creates backups automatically
- Updates package.json
- Installs dependencies
- Usage: `./migrate.sh /path/to/occupant-index /path/to/improved-succotash`

## Migration Goal

Replace improved-succotash's HTML/CSS/JS frontend with occupant-index's React/TypeScript/shadcn design, while keeping all Python backend functionality.

**Before:**
```
improved-succotash/
├── index.html          (basic HTML)
├── styles.css          (basic CSS)
├── theme.js            (theme toggle)
├── compute_cpi.py      (Python backend)
└── data/               (generated JSON)
```

**After:**
```
improved-succotash/
├── src/                (React components)
├── public/             (static assets + data)
├── package.json        (npm dependencies)
├── vite.config.ts      (build config)
├── compute_cpi.py      (Python backend - unchanged)
└── data/               (generated JSON - unchanged)
```

## Recommended Workflow

1. **Read QUICK_START.md** (5 minutes)
2. **Run migrate.sh** (15 minutes)
3. **Test in browser** (10 minutes)
4. **Fix data structure** using MIGRATION_GUIDE.md or DATA_ADAPTER_EXAMPLE.ts (1-2 hours)
5. **Verify all features** (30 minutes)
6. **Commit and deploy** (30 minutes)

**Total time: 3-4 hours**

## Key Decisions

### Decision 1: Data Structure
- **Option A:** Update Python backend to match React expectations (recommended)
- **Option B:** Use data adapter to transform JSON at runtime

### Decision 2: Data Location
- **Option A:** Move data to `public/data/` (simpler)
- **Option B:** Configure Vite to serve `/data/` from root (current structure)

### Decision 3: Deployment
- **Option A:** Static site (build to dist/, serve with any host)
- **Option B:** Python server (Flask/FastAPI serving React build)

## Support Files

All migration files are in this repository:
- Documentation: `MIGRATION_GUIDE.md`, `QUICK_START.md`
- Scripts: `migrate.sh`
- Examples: `DATA_ADAPTER_EXAMPLE.ts`

## Success Criteria

Migration is complete when:
- [x] React app runs in development (`npm run dev`)
- [x] All pages load without errors
- [x] Real data displays from JSON files
- [x] Production build works (`npm run build`)
- [x] No console errors
- [x] Mobile responsive
- [x] Python backend still works

## What Stays the Same

✅ Python data generation (compute_cpi.py)  
✅ All Python scripts and dependencies  
✅ Data collection and processing logic  
✅ JSON output format (or adapted)  
✅ Git history  
✅ Cron jobs / automation  

## What Changes

🔄 HTML files → React components  
🔄 CSS file → Tailwind CSS + shadcn/ui  
🔄 JavaScript → TypeScript  
🔄 No build system → Vite  
🔄 Static site → React SPA  

## File Summary

**From occupant-index (80+ files):**
- 15 configuration files
- 40+ shadcn/ui components
- 12 page components
- 5+ utility/service files
- Build and test configs

**Preserved in improved-succotash:**
- All Python files (.py)
- Data directory structure
- Backend scripts
- Python dependencies (requirements.txt)

## Quick Commands

```bash
# Clone and setup
git clone https://github.com/quarterback/improved-succotash.git
cd improved-succotash
git checkout copilot/add-aminute-font-to-logo

# Automated migration
chmod +x /path/to/occupant-index/migrate.sh
/path/to/occupant-index/migrate.sh /path/to/occupant-index .

# Test
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build

# Python backend (unchanged)
python compute_cpi.py
```

## Getting Help

1. Start with QUICK_START.md
2. Reference MIGRATION_GUIDE.md for details
3. Check DATA_ADAPTER_EXAMPLE.ts for data issues
4. Compare against working occupant-index
5. Check browser console for errors

## Final Notes

- ✅ This migration preserves all functionality
- ✅ Python backend remains unchanged
- ✅ Easy to rollback (git or backup/)
- ✅ Improves user experience with React
- ✅ Maintains data integrity
- ✅ Adds modern tooling (TypeScript, Vite, etc.)

**Ready to migrate?** Start with QUICK_START.md!
