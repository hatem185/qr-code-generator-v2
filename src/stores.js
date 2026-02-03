import { writable, derived } from 'svelte/store';
import { QR_TYPES } from './lib/constants';

// QR Type
export const qrType = writable(QR_TYPES.ORDERS);

// Base URL
export const baseUrl = writable("");

// QR Code Lists
export const qrCodeList = writable([]);
export const qrPage = writable([]);
export const lastItemPage = writable(0);

// History
export const currentHistoryPage = writable(1);
export const qrHistoryData = writable({
  page: 1,
  fetchedLength: 0,
  data: []
});

// Generation state
export const isGenerated = writable(false);

// Offline mode
export const isOfflineMode = writable(false);

// Layout modes
export const boxLayoutMode = writable("grid");
export const customLayoutMode = writable("grid");

// QR Format modes (JSON vs Raw Text)
export const ordersFormat = writable("json"); // "json" or "raw"
export const boxFormat = writable("json"); // "json" or "raw"

// Form inputs
export const initialSerialNumber = writable("");
export const qtyCode = writable("");
export const numberOfPages = writable("");
export const customPrefix = writable("");
export const customSuffix = writable("");
export const boxSuffix = writable("BN");

// UI State
export const showLoadingIndicator = writable(false);
export const alertMessage = writable({ message: "", type: "" });
export const showAllPages = writable(false);

// Print position offsets (in mm)
export const printOffsetTop = writable(0);
export const printOffsetLeft = writable(0);

// Per-row vertical offsets (in mm)
export const printRowOffset1 = writable(0);
export const printRowOffset2 = writable(0);
export const printRowOffset3 = writable(0);

// Horizontal spacing between columns (in mm)
export const printColumnGap = writable(0);

// Derived stores
export const isBoxType = derived(qrType, $qrType => $qrType.toLowerCase() === "box");
export const isCustomType = derived(qrType, $qrType => $qrType.toLowerCase() === "custom");
export const isOrdersType = derived(qrType, $qrType => $qrType.toLowerCase() === "orders");

