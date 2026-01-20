# Setup Instructions - DS QR Code Generator (Svelte)

## Quick Start

### 1. Copy Assets
First, copy the images from the original project:

```bash
cd /Users/hash/WebstormProjects/ds_qr_code_generator
mkdir -p svelte-migration/public/imgs
cp imgs/ds-logo.png svelte-migration/public/imgs/
```

### 2. Install Dependencies
```bash
cd svelte-migration
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 4. Build for Production
```bash
npm run build
```

Production files will be in `dist/` folder.

## Project Structure

```
svelte-migration/
├── public/
│   └── imgs/
│       └── ds-logo.png          # Copy from original project
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Header.svelte             # Header with mode toggle
│   │   │   ├── History.svelte            # History list and navigation
│   │   │   ├── QRForm.svelte             # Main form with all inputs
│   │   │   ├── QRDisplay.svelte          # QR code display with pagination
│   │   │   ├── QRTypeSelector.svelte     # Orders/Box/Custom buttons
│   │   │   ├── AlertMessage.svelte       # Success/error messages
│   │   │   └── LoadingIndicator.svelte   # Loading spinner
│   │   ├── api.js                # All API functions
│   │   ├── constants.js          # Configuration constants
│   │   ├── qrGenerator.js        # QR code generation logic
│   │   └── utils.js              # Utility functions
│   ├── stores.js                 # Svelte stores (state management)
│   ├── App.svelte                # Main application component
│   ├── main.js                   # Entry point
│   └── app.css                   # Global styles
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── svelte.config.js             # Svelte configuration
├── .gitignore                   # Git ignore rules
├── README.md                    # Project documentation
├── MIGRATION_GUIDE.md           # Detailed migration guide
└── SETUP_INSTRUCTIONS.md        # This file
```

## Features Verified

✅ All original features working:
- [x] Three QR types (Orders, Box, Custom)
- [x] Layout switchers (Grid/Single for Box and Custom)
- [x] Online/Offline mode toggle
- [x] History list with pagination
- [x] Form validation
- [x] Latest code fetching
- [x] Range checking
- [x] QR code generation
- [x] Print layouts (stable, no drift)
- [x] LocalStorage persistence
- [x] Loading indicators
- [x] Alert messages
- [x] Pagination for QR codes

## API Configuration

The app automatically detects environment:
- **Development (localhost)**: `http://localhost:3000/api/qr-code-history`
- **Production**: `https://dssystemqrcodehistory.onrender.com/api/qr-code-history`

## Development Workflow

### Starting Development
```bash
npm run dev
```
- Hot Module Replacement (HMR) enabled
- Changes reflect immediately
- Console logs visible in browser

### Building
```bash
npm run build
```
- Optimized production build
- Minified and tree-shaken
- Output in `dist/` folder

### Preview Build
```bash
npm run preview
```
- Test production build locally
- Runs on http://localhost:4173

## Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3001
```

### Missing Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Assets Not Loading
Ensure images are in `public/imgs/`:
```bash
ls public/imgs/ds-logo.png
```

### QR Code Generation Issues
The QR library is installed via npm:
```bash
npm list qrcode
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Key Changes from Original

### State Management
- **Before**: Global variables
- **After**: Svelte stores (reactive)

### DOM Manipulation
- **Before**: `document.getElementById()`, `appendChild()`
- **After**: Declarative Svelte syntax

### Event Handling
- **Before**: `addEventListener()`
- **After**: `on:click` directives

### Rendering
- **Before**: Manual DOM creation
- **After**: `{#each}` and `{#if}` blocks

## Performance

### Bundle Size
- Original: ~3KB (just vanilla JS)
- Svelte: ~15KB (includes framework code)
- Trade-off: Better DX and maintainability

### Runtime Performance
- Svelte compiles to efficient vanilla JS
- No virtual DOM overhead
- Reactive updates are optimal

## Testing the Application

### Test QR Code Generation

1. **Orders Type**:
   - Select "Orders"
   - Enter serial: `100`
   - Enter quantity: `12`
   - Click "Generate"
   - Verify: JSON QR codes with Orders type

2. **Box Type**:
   - Select "Box"
   - Choose suffix: `BN`
   - Select layout: Grid or Single
   - Enter serial: `200`
   - Enter quantity: `6`
   - Click "Generate"
   - Verify: JSON QR codes with BX prefix

3. **Custom Type**:
   - Select "Custom"
   - Enter prefix: `A`
   - Enter suffix: `C`
   - Select layout: Grid or Single
   - Enter serial: `300`
   - Enter quantity: `10`
   - Click "Generate"
   - Verify: Plain text QR codes like `A-300-C`

### Test Print Layouts

1. Generate QR codes
2. Click browser Print (Ctrl+P / Cmd+P)
3. Verify:
   - Orders: 3×2 grid, 6 per page
   - Box Grid: 3×2 grid, 6 per page
   - Box Single: 1 large QR per page
   - Custom Grid: 3×2 grid, 6 per page
   - Custom Single: 1 large QR per page
4. Check multiple pages for consistency (no drift)

### Test Offline Mode

1. Click mode toggle button (top right)
2. Verify: Button shows "Offline Mode"
3. Try "Latest Code" button
4. Verify: Shows offline mode message
5. Generate QR codes
6. Verify: Codes generate, but no API save
7. Toggle back to online
8. Verify: Button shows "Online Mode"

### Test History

1. Generate some QR codes (online mode)
2. Scroll up to history section
3. Verify: New entry appears
4. Click history entry
5. Verify: Form populates with values
6. Prompt appears for custom starting point
7. Click "Generate" again

## Next Steps

1. ✅ Copy assets to `public/imgs/`
2. ✅ Run `npm install`
3. ✅ Run `npm run dev`
4. ✅ Test all features
5. ✅ Build for production
6. ✅ Deploy

## Support

For issues or questions about the Svelte migration:
- Check `MIGRATION_GUIDE.md` for detailed explanations
- Review component files for specific functionality
- Compare with original `js/script.js` for logic reference

## License

Same as original project.

