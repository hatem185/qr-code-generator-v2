import { baseUrl } from '../stores';
import { CONFIG } from './constants';

let currentBaseUrl = "";
baseUrl.subscribe(value => currentBaseUrl = value);

/**
 * Capitalizes the first letter of a string
 */
export function capitalise(str = "") {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a timestamp to readable date format
 */
export function formatTimestamp(timestampString) {
  const dateObj = new Date(timestampString);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const hours = dateObj.getHours() === 0 ? 12 : dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const amPm = dateObj.getHours() >= 12 ? "PM" : "AM";
  
  return `${year}-${month}-${day} ${hours}:${minutes} ${amPm}`;
}

/**
 * Sets the base URL based on the current environment
 */
export function setBaseUrl() {
  const pageUrl = window.location.href;
  if (pageUrl.includes("localhost") || pageUrl.includes("127.0.0.1")) {
    return CONFIG.API_URLS.LOCAL;
  } else {
    return CONFIG.API_URLS.PRODUCTION;
  }
}

/**
 * Load preference from localStorage
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Save preference to localStorage
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

