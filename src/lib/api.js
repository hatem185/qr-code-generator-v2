import { get } from 'svelte/store';
import { baseUrl, isOfflineMode, qrHistoryData } from '../stores';
import { capitalise } from './utils';
import { CONFIG } from './constants';

/**
 * Creates data form for history
 */
export function createHistoryDataForm(initNumber, qty, type, suffix = null, prefix = null) {
  const typeLower = type.toLowerCase();
  
  return JSON.stringify({
    serial_number: initNumber,
    qty_codes: qty,
    printed_pages_number: 0,
    type: capitalise(type),
    suffix: suffix,
    prefix: prefix
  });
}

/**
 * Fetches history data from the server
 */
export async function fetchHistories(page = 1, limit = CONFIG.LIMIT_OF_NUMBER_PAGE) {
  if (get(isOfflineMode)) {
    console.log("Offline mode: Skipping history fetch");
    return null;
  }
  
  try {
    const response = await fetch(
      `${get(baseUrl)}/histories?page=${page}&limit=${limit}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching histories:", error);
    return null;
  }
}

/**
 * Loads histories into state
 */
export async function loadHistories(page) {
  const result = await fetchHistories(page);
  if (result) {
    qrHistoryData.update(state => ({
      ...state,
      fetchedLength: result.fetchedLength,
      page: result.page,
      data: [...state.data, ...result.data]
    }));
  }
}

/**
 * Gets the latest code from history
 */
export async function getLatestCode(type) {
  if (get(isOfflineMode)) {
    return {
      message: "Offline mode",
      latestCode: -1
    };
  }
  
  try {
    const response = await fetch(
      `${get(baseUrl)}/latest-code-history?type=${type}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting latest code:", error);
    return {
      message: error,
      latestCode: -1
    };
  }
}

/**
 * Checks if a range exists in history
 */
export async function checkRangeInHistory(serialNumber, qty, type) {
  if (get(isOfflineMode)) {
    console.log("Offline mode: Skipping range check");
    return {
      message: "Offline mode - range check skipped",
      exists: "not_exists"
    };
  }
  
  try {
    const response = await fetch(
      `${get(baseUrl)}/check-range-in-history?serial_number=${serialNumber}&qty_codes=${qty}&type=${type}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking range:", error);
    return {
      message: error.toString(),
      exists: "not_exists"
    };
  }
}

/**
 * Saves generated range to history
 */
export async function saveGeneratedRangeHistory(initNumber, qty, type, suffix = null, prefix = null) {
  if (get(isOfflineMode)) {
    console.log("Offline mode: Skipping history save");
    return null;
  }
  
  try {
    const dataForm = createHistoryDataForm(initNumber, qty, type, suffix, prefix);
    console.log("Saving range history:", dataForm);
    
    const response = await fetch(`${get(baseUrl)}/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: dataForm
    });
    
    const data = await response.json();
    if (response.status === 201) {
      return data;
    }
  } catch (error) {
    console.error("Error saving history:", error);
  }
  
  return null;
}

