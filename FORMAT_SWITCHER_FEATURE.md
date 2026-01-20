# QR Data Format Switcher Feature

## Overview

Added a format switcher for Orders and Box QR types to toggle between JSON and Raw Text formats.

## Feature Details

### Orders Type
**JSON Format (Default):**
```json
{"client":"Sabil","type":"Orders","code":"12234"}
```

**Raw Format:**
```
12234
```

### Box Type
**JSON Format (Default):**
```json
{"client":"Sabil","type":"Box","code":"BX100BN"}
```

**Raw Format:**
```
BX100BN
```

### Custom Type
**Always Raw Format** (no change):
```
A-111-C
```

## UI Implementation

### Orders Type
When "Orders" is selected, a format switcher appears with:
- Dropdown with two options: JSON / Raw Text
- Live example showing what the QR code will contain
- Yellow/amber color theme (warning color to indicate format choice)

### Box Type
When "Box" is selected, a format switcher appears with:
- Dropdown with two options: JSON / Raw Text
- Live example showing what the QR code will contain
- Yellow/amber color theme

### Custom Type
No format switcher (always raw text with dashes)

## Files Modified

### 1. `src/stores.js`
Added two new stores:
```javascript
export const ordersFormat = writable("json"); // "json" or "raw"
export const boxFormat = writable("json");    // "json" or "raw"
```

### 2. `src/lib/components/QRForm.svelte`
- Imported `ordersFormat` and `boxFormat` stores
- Added format switcher UI for Orders type
- Added format switcher UI for Box type
- Added handler functions for format changes
- Added live examples showing QR content

### 3. `src/lib/qrGenerator.js`
Updated QR data creation functions to accept format parameter:

```javascript
export function createQROrdersData(initialNumber, type, client, format = "json") {
  const code = `${initialNumber}`;
  
  if (format === "raw") {
    return code; // Return raw text only
  }
  
  return JSON.stringify({
    client: client,
    type: type,
    code: code
  });
}

export function createQRBoxData(initialNumber, type, client, boxSuffix, format = "json") {
  const code = `BX${initialNumber}${boxSuffix.toUpperCase()}`;
  
  if (format === "raw") {
    return code; // Return raw text only
  }
  
  return JSON.stringify({
    client: client,
    type: type,
    code: code
  });
}
```

### 4. `src/App.svelte`
- Imported `ordersFormat` and `boxFormat` stores
- Passed format parameter to QR data creation functions
- Added localStorage loading for format preferences

### 5. `src/app.css`
Added styling for format switcher:
- Yellow/amber theme to distinguish from layout switchers
- Format hint box with live examples
- Responsive code display

## Usage

### For Orders Type:

1. Select **"Orders"** type
2. Format switcher appears below type buttons
3. Choose format:
   - **JSON**: Full metadata included
   - **Raw Text**: Just the number
4. See live example update
5. Generate QR codes
6. Scan to verify format

### For Box Type:

1. Select **"Box"** type
2. Format switcher appears below type buttons
3. Choose suffix (e.g., "BN")
4. Choose format:
   - **JSON**: Full metadata included
   - **Raw Text**: Just the code (e.g., BX100BN)
5. See live example update
6. Generate QR codes
7. Scan to verify format

## Persistence

Format preferences are saved to localStorage:
- `qrOrdersFormat`: "json" or "raw"
- `qrBoxFormat`: "json" or "raw"

Preferences persist across page reloads.

## Examples

### Orders - JSON Format
Input: `12234`
QR Contains:
```json
{"client":"Sabil","type":"Orders","code":"12234"}
```
Scan Result: JSON string

### Orders - Raw Format
Input: `12234`
QR Contains:
```
12234
```
Scan Result: Just the number

### Box - JSON Format
Input: `100`, Suffix: `BN`
QR Contains:
```json
{"client":"Sabil","type":"Box","code":"BX100BN"}
```
Scan Result: JSON string

### Box - Raw Format
Input: `100`, Suffix: `BN`
QR Contains:
```
BX100BN
```
Scan Result: Just the code

### Custom (Always Raw)
Input: `111`, Prefix: `A`, Suffix: `C`
QR Contains:
```
A-111-C
```
Scan Result: Plain text with dashes

## Use Cases

### JSON Format (Default)
**Use when:**
- Need client information in QR
- Need type metadata
- Backend expects JSON
- Need structured data

### Raw Format
**Use when:**
- Simple scanning needed
- Only code number matters
- Better readability when scanned
- External system expects plain text
- Shorter QR codes (less data)

## Benefits

✅ **Flexibility**: Choose format based on use case
✅ **Backward Compatible**: JSON is default (existing behavior)
✅ **Simpler QR Codes**: Raw format creates smaller, simpler QR codes
✅ **Live Preview**: See exact QR content before generating
✅ **Persistent**: Preference saved across sessions
✅ **Clear UI**: Distinct yellow theme for format selection

## Technical Notes

- Format switcher only appears for Orders and Box types
- Custom type always uses raw format with dashes
- Default is JSON to maintain backward compatibility
- Format preference is type-specific (Orders and Box have separate settings)
- QR code size remains unchanged regardless of format

## Testing

### Test Orders - JSON
1. Select Orders
2. Choose "JSON" format
3. Enter serial: `100`
4. Generate
5. Scan QR → Should get JSON string

### Test Orders - Raw
1. Select Orders
2. Choose "Raw Text" format
3. Enter serial: `200`
4. Generate
5. Scan QR → Should get just "200"

### Test Box - JSON
1. Select Box
2. Choose "JSON" format
3. Choose suffix: "BN"
4. Enter serial: `300`
5. Generate
6. Scan QR → Should get JSON string

### Test Box - Raw
1. Select Box
2. Choose "Raw Text" format
3. Choose suffix: "BN"
4. Enter serial: `400`
5. Generate
6. Scan QR → Should get "BX400BN"

### Test Custom (No change)
1. Select Custom
2. No format switcher appears
3. Enter prefix: "A", suffix: "C"
4. Enter serial: `500`
5. Generate
6. Scan QR → Should get "A-500-C"

## API Compatibility

History saving still uses JSON format for metadata, but the actual QR codes contain the selected format.

The history API receives:
```javascript
{
  serial_number: 100,
  qty_codes: 10,
  type: "Orders",
  suffix: null,
  prefix: null
}
```

The format choice affects only the QR code content, not the history metadata.

