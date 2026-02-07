import QRCode from 'qrcode';
import { CONFIG } from './constants';

/**
 * Generates the text content for QR code display
 */
export function getQRCodeTextContent(code, type, customPrefix = "", customSuffix = "", boxSuffix = "BN", includeDash = true) {
  const typeLower = type.toLowerCase();
  const separator = includeDash ? "-" : "";
  
  if (typeLower === "box") {
    return `BX${code}${boxSuffix}`;
  } else if (typeLower === "custom") {
    let result = code;
    if (customPrefix) {
      result = `${customPrefix}${separator}${result}`;
    }
    if (customSuffix) {
      result = `${result}${separator}${customSuffix}`;
    }
    return result;
  }
  
  return code;
}

/**
 * Creates QR data for Box type
 */
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

/**
 * Creates QR data for Orders type
 */
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

/**
 * Creates QR data for Custom type (plain text, no JSON)
 */
export function createQRCustomData(initialNumber, customPrefix = "", customSuffix = "", includeDash = true) {
  const separator = includeDash ? "-" : "";
  let result = initialNumber.toString();
  if (customPrefix) {
    result = `${customPrefix}${separator}${result}`;
  }
  if (customSuffix) {
    result = `${result}${separator}${customSuffix}`;
  }
  return result;
}

/**
 * Gets QR code size based on type and layout
 */
export function getQRCodeSize(type, layoutMode = "grid") {
  const typeLower = type.toLowerCase();
  
  if (typeLower === "box") {
    return CONFIG.QR_SIZE_BOX;
  } else if (typeLower === "custom") {
    return layoutMode === "single" ? CONFIG.QR_SIZE_BOX : CONFIG.QR_SIZE_ORDERS;
  }
  
  return CONFIG.QR_SIZE_ORDERS;
}

/**
 * Generates QR code as data URL
 */
export async function generateQRCodeDataURL(data, size) {
  try {
    const dataURL = await QRCode.toDataURL(data, {
      width: size,
      height: size,
      margin: 1,
      errorCorrectionLevel: 'H'
    });
    return dataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
}

/**
 * Gets the appropriate QR data generator function
 */
export function getQRDataGenerator(type) {
  const typeLower = type.toLowerCase();
  
  if (typeLower === "orders") {
    return createQROrdersData;
  } else if (typeLower === "box") {
    return createQRBoxData;
  } else if (typeLower === "custom") {
    return createQRCustomData;
  }
  
  return createQROrdersData;
}

