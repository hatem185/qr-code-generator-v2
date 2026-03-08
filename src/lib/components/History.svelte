<script>
  import { onMount } from 'svelte';
  import { qrHistoryData, currentHistoryPage, qrType, customPrefix, customSuffix, boxSuffix, initialSerialNumber, qtyCode } from '../../stores';
  import { loadHistories } from '../api';
  import { formatTimestamp } from '../utils';
  import { CONFIG, QR_TYPES } from '../constants';

  export let onHistoryItemClick;

  let displayedHistory = [];

  $: {
    const fromIndex = ($currentHistoryPage - 1) * CONFIG.HISTORY_ITEMS_PER_PAGE;
    const toIndex = fromIndex + CONFIG.HISTORY_ITEMS_PER_PAGE;
    displayedHistory = $qrHistoryData.data.slice(fromIndex, toIndex);
  }

  async function handleNextPage() {
    const fromIndex = $currentHistoryPage * CONFIG.HISTORY_ITEMS_PER_PAGE;
    
    if ($qrHistoryData.data.length > fromIndex) {
      currentHistoryPage.update(val => val + 1);
    } else if (
      fromIndex >= $qrHistoryData.data.length &&
      $qrHistoryData.fetchedLength === CONFIG.LIMIT_OF_NUMBER_PAGE
    ) {
      await loadHistories($qrHistoryData.page + 1);
      if ($qrHistoryData.data.length > fromIndex) {
        currentHistoryPage.update(val => val + 1);
      }
    } else {
      currentHistoryPage.set(1);
      qrHistoryData.update(state => ({ ...state, data: [] }));
      await loadHistories(1);
    }
  }

  async function handlePrevPage(e) {
    e.preventDefault();
    if ($currentHistoryPage === 1) return;
    currentHistoryPage.update(val => val - 1);
  }

  async function handleHistoryClick(item) {
    const value = window.prompt(
      "Please enter the starting code within the specified range for generation"
    );
    
    const typeLower = item.type?.toLowerCase?.() ?? "";
    if (typeLower === "box") {
      boxSuffix.set(item.suffix ?? "BN");
      qrType.set(QR_TYPES.BOX);
    } else if (typeLower === "orders") {
      qrType.set(QR_TYPES.ORDERS);
    } else if (typeLower === "custom") {
      customPrefix.set(item.prefix || "");
      customSuffix.set(item.suffix || "");
      qrType.set(QR_TYPES.CUSTOM);
    }
    
    if (value && +value > item.first_code && +value < item.first_code + item.qty_codes - 1) {
      initialSerialNumber.set(value);
      qtyCode.set((item.qty_codes - (+value - item.first_code)).toString());
    } else {
      initialSerialNumber.set(item.first_code.toString());
      qtyCode.set(item.qty_codes.toString());
    }
    
    await onHistoryItemClick();
  }

  function getTypeColor(type) {
    const typeLower = type?.toLowerCase();
    if (typeLower === "orders") return "red";
    if (typeLower === "box") return "green";
    if (typeLower === "custom") return "#4a90e2";
    return "black";
  }

  onMount(async () => {
    await loadHistories(1);
  });
</script>

<div class="history-list-container dont-print">
  <h2 style="margin: 16px 16px 0">Generated History List</h2>
  <ul id="history-list">
    {#each displayedHistory as item (item._id || item.id)}
      <li class="history-card">
        <button 
          type="button"
          class="history-card-btn"
          on:click={() => handleHistoryClick(item)}
        >
          <h3 style="color: {getTypeColor(item.type)}">{item.type}</h3>
          <h4>First code: {item.first_code}</h4>
          <h4>Last code: {item.last_code}</h4>
          <h4>Created At: {formatTimestamp(item.createdAt)}</h4>
        </button>
      </li>
    {/each}
  </ul>
  <div id="switch-history-controller">
    <button type="button" id="prev-history-page" on:click={handlePrevPage}>Previous</button>
    <button type="button" id="next-history-page" on:click={handleNextPage}>Next</button>
  </div>
</div>

<style>
  .history-list-container {
    width: 100%;
  }

  #history-list {
    width: 100%;
    margin: 8px 0 25px;
    padding: 0 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    list-style: none;
  }

  .history-card {
    width: calc((100% / 4) - 4px);
    overflow: hidden;
    padding: 0;
    background-color: rgb(225, 225, 225);
    border: 2px solid rgb(159, 159, 159);
    border-radius: 8px;
  }

  .history-card-btn {
    width: 100%;
    padding: 25px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
  }

  .history-card-btn:hover {
    background-color: rgb(215, 215, 215);
  }

  .history-card h3 {
    margin: 0 0 8px 0;
  }

  .history-card h4 {
    margin: 4px 0;
    font-size: 14px;
  }

  #switch-history-controller {
    width: 100%;
    display: flex;
    padding: 0 25px;
    justify-content: space-between;
  }

  #switch-history-controller button {
    color: black;
    background-color: white;
    padding: 8px 16px;
    border: 1px solid rgb(210, 68, 68);
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
  }

  #switch-history-controller button:hover {
    background-color: rgb(210, 68, 68);
    color: white;
  }
</style>

