export const CONFIG = {
  LIMIT_OF_NUMBER_PAGE: 16,
  QR_CODES_PER_PAGE: 6,
  HISTORY_ITEMS_PER_PAGE: 4,
  QR_SIZE_BOX: 500,
  QR_SIZE_ORDERS: 250,
  API_URLS: {
    LOCAL: "http://localhost:3000/api/qr-code-history",
    PRODUCTION: "https://dssystemqrcodehistory.onrender.com/api/qr-code-history"
  }
};

export const QR_TYPES = {
  ORDERS: "Orders",
  BOX: "Box",
  CUSTOM: "Custom"
};

export const BOX_SUFFIX_OPTIONS = ["BN", "ZW", "MS", "WA", "SB", "AG", "KF", "TS", "MJ", "RJ", "TJ", "TH", "TZ", "Other"];

