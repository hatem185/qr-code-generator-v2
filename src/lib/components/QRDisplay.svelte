<script>
  import { onMount } from 'svelte';
  import { qrCodeList, qrPage, lastItemPage, showAllPages } from '../../stores';
  import { CONFIG } from '../constants';

  export let qrCodes = [];

  let showPagination = false;

  // Always show all codes in print, otherwise follow showAllPages
  $: displayedCodes = $showAllPages ? qrCodes : $qrPage;
  $: showPagination = qrCodes.length > CONFIG.QR_CODES_PER_PAGE;
  $: showAllBtnText = $showAllPages ? "Hide all" : "Show all";

  function handleShowAll() {
    showAllPages.update(val => !val);
  }

  function handleNextPage() {
    if (qrCodes.length <= $lastItemPage) return;
    
    const nextPage = qrCodes.slice($lastItemPage, $lastItemPage + CONFIG.QR_CODES_PER_PAGE);
    qrPage.set(nextPage);
    lastItemPage.update(val => val + nextPage.length);
  }

  function handlePrevPage() {
    if ($lastItemPage <= CONFIG.QR_CODES_PER_PAGE) return;
    
    lastItemPage.update(val => val - $qrPage.length);
    const prevPage = qrCodes.slice($lastItemPage - CONFIG.QR_CODES_PER_PAGE, $lastItemPage);
    qrPage.set(prevPage);
  }
</script>

<div class="qr-display-section">
  {#if showPagination}
    <button id="show-all-page" class="dont-print" on:click={handleShowAll}>
      {showAllBtnText}
    </button>
  {/if}

  <div id="qr-code-container">
    {#each displayedCodes as qrCode (qrCode.id)}
      <div class="qr-code-item" id="qr-code-{qrCode.id}">
        <div class="qr-code-wrapper">
          <h2 class="qr-code-text">{qrCode.text}</h2>
          <img src={qrCode.dataURL} alt="QR Code {qrCode.text}" />
        </div>
      </div>
    {/each}
  </div>

  {#if showPagination && !$showAllPages}
    <div id="page-switcher" class="dont-print">
      <button id="prev-page" on:click={handlePrevPage}>Previous</button>
      <button id="next-page" on:click={handleNextPage}>Next</button>
    </div>
  {/if}
</div>

<style>
  #qr-code-container {
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 48px;
    width: 85%;
  }

  .qr-code-item {
    width: 350px;
    height: 250px;
    background-color: rgb(210, 68, 68);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qr-code-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .qr-code-wrapper img {
    width: 150px !important;
    height: 150px !important;
  }

  #page-switcher {
    margin: 50px auto;
    display: flex;
    width: 85%;
    justify-content: space-between;
  }

  #page-switcher button,
  #show-all-page {
    color: black;
    border: 1px solid;
    padding: 16px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    background-color: white;
    font-family: inherit;
  }

  #page-switcher button:hover,
  #show-all-page:hover {
    opacity: 0.9;
  }

  #show-all-page {
    display: block;
    width: fit-content;
    margin: 32px auto;
    color: white;
    background-color: rgb(210, 68, 68);
    border-color: rgb(210, 68, 68);
  }

  #next-page {
    border-color: black;
    background-color: rgb(210, 68, 68);
    color: white;
  }

  #prev-page {
    border-color: rgb(210, 68, 68);
    color: rgb(210, 68, 68);
  }
</style>

