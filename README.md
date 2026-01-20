# DS QR Code Generator - Svelte Migration

This is a complete Svelte migration of the original vanilla JavaScript QR code generator application.

## Features

All original functionality has been preserved:

✅ **Three QR Code Types:**
- **Orders**: JSON format with client and code
- **Box**: JSON format with BX prefix and configurable suffix
- **Custom**: Plain text with optional prefix/suffix and dashes

✅ **Layout Options:**
- Box and Custom types support Grid (3×2) or Single (1 per page) layouts
- Orders type uses standard 3×2 grid

✅ **Online/Offline Mode:**
- Toggle between online and offline modes
- Offline mode disables API calls but allows QR generation
- Mode preference saved to localStorage

✅ **History Management:**
- View previously generated QR code batches
- Click history items to regenerate
- Pagination for history list

✅ **Print Optimizations:**
- Stable print layout (no QR code drift)
- Different layouts for different QR types
- Proper page breaks

✅ **Additional Features:**
- Latest code fetching from API
- Range checking to prevent duplicates
- Form validation
- Loading indicators
- Alert messages
- Pagination for QR code display

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
svelte-migration/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Header.svelte
│   │   │   ├── History.svelte
│   │   │   ├── QRForm.svelte
│   │   │   ├── QRDisplay.svelte
│   │   │   ├── QRTypeSelector.svelte
│   │   │   ├── AlertMessage.svelte
│   │   │   └── LoadingIndicator.svelte
│   │   ├── api.js (API functions)
│   │   ├── constants.js (Configuration)
│   │   ├── qrGenerator.js (QR code generation logic)
│   │   └── utils.js (Utility functions)
│   ├── stores.js (Svelte stores for state management)
│   ├── App.svelte (Main application component)
│   ├── main.js (Entry point)
│   └── app.css (Global styles)
├── public/
│   └── imgs/
│       └── ds-logo.png
├── index.html
├── package.json
└── vite.config.js
```

## Assets

Make sure to copy the `imgs/` folder from the original project to `svelte-migration/public/imgs/`:

```bash
cp -r imgs/ svelte-migration/public/imgs/
```

## Technology Stack

- **Svelte 4.2**: Reactive UI framework
- **Vite 5.0**: Build tool and dev server
- **QRCode**: QR code generation library

## Differences from Original

### Architecture
- **Component-based**: Split into logical Svelte components
- **Reactive State**: Uses Svelte stores instead of vanilla JS variables
- **Declarative UI**: Svelte's reactive syntax replaces DOM manipulation
- **Modular**: Better separation of concerns

### File Organization
- Business logic separated from UI
- API calls in dedicated module
- Utility functions centralized
- Constants in separate file

### Code Quality
- TypeScript-ready structure
- More maintainable
- Easier to test
- Better developer experience

## API Configuration

The application automatically detects the environment:
- **Localhost**: Uses `http://localhost:3000/api/qr-code-history`
- **Production**: Uses `https://dssystemqrcodehistory.onrender.com/api/qr-code-history`

## Browser Compatibility

Works in all modern browsers that support:
- ES6+
- CSS Grid
- Flexbox
- LocalStorage
- Print Media Queries

## License

Same as original project.

