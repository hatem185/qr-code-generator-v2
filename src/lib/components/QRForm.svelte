<script>
  import { 
    qrType, 
    initialSerialNumber, 
    qtyCode, 
    numberOfPages,
    customPrefix,
    customSuffix,
    customIncludeDash,
    boxSuffix,
    boxLayoutMode,
    customLayoutMode,
    ordersFormat,
    boxFormat,
    isGenerated,
    showLoadingIndicator,
    alertMessage
  } from '../../stores';
  import { saveToStorage } from '../utils';
  import { getLatestCode, checkRangeInHistory } from '../api';
  import { CONFIG } from '../constants';
  import QRTypeSelector from './QRTypeSelector.svelte';
  
  export let onGenerate;

  let boxSuffixOptions = ["BN", "ZW", "MS", "WA", "SB", "AG", "KF", "TS", "MJ", "RJ", "TJ"];

  $: isBox = $qrType.toLowerCase() === "box";
  $: isCustom = $qrType.toLowerCase() === "custom";
  $: isOrders = $qrType.toLowerCase() === "orders";

  function handleNumberOfPagesInput() {
    qtyCode.set("");
  }

  function handleBoxLayoutChange(e) {
    boxLayoutMode.set(e.target.value);
    saveToStorage("qrBoxLayoutMode", e.target.value);
  }

  function handleCustomLayoutChange(e) {
    customLayoutMode.set(e.target.value);
    saveToStorage("qrCustomLayoutMode", e.target.value);
  }

  function handleOrdersFormatChange(e) {
    ordersFormat.set(e.target.value);
    saveToStorage("qrOrdersFormat", e.target.value);
  }

  function handleBoxFormatChange(e) {
    boxFormat.set(e.target.value);
    saveToStorage("qrBoxFormat", e.target.value);
  }

  async function handleLatestCode() {
    if ($isGenerated) return;
    
    showLoadingIndicator.set(true);
    const result = await getLatestCode($qrType);
    showLoadingIndicator.set(false);
    
    if (result?.latestCode != -1) {
      initialSerialNumber.set((+result.latestCode + 1).toString());
    }
  }

  function validateForm() {
    if (!($initialSerialNumber.trim().length > 0)) {
      alertMessage.set({ message: "Please enter the initial Serial Number", type: "alert-error" });
      return false;
    }
    
    const qty = +$qtyCode;
    const nop = +$numberOfPages;
    
    if ((isNaN(qty) || qty <= 0) && (isNaN(nop) || nop <= 0)) {
      alertMessage.set({ 
        message: "Please enter valid quantity of page of numbers", 
        type: "alert-error" 
      });
      return false;
    }
    
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    alertMessage.set({ message: "", type: "" });
    
    if (!validateForm()) return;
    if ($isGenerated) return;
    
    const nop = $numberOfPages;
    const qty = nop && !isNaN(+nop) && +nop > 0 
      ? +nop * CONFIG.QR_CODES_PER_PAGE 
      : +$qtyCode;

    const resultChecking = await checkRangeInHistory(+$initialSerialNumber, qty, $qrType);
    
    if (resultChecking.exists === "not_exists") {
      await onGenerate();
      return;
    }
    
    alertMessage.set({ message: resultChecking.message, type: "alert-error" });
  }
</script>

<form action="./" id="qr-form-generator" on:submit={handleSubmit}>
  <QRTypeSelector />
  
  {#if isOrders}
    <div class="format-switcher">
      <label for="orders-format-select">
        <h5 class="label-text">QR Data Format:</h5>
      </label>
      <select 
        id="orders-format-select" 
        class="format-select"
        bind:value={$ordersFormat}
        on:change={handleOrdersFormatChange}
      >
        <option value="json">JSON (with client & type info)</option>
        <option value="raw">Raw Text (number only)</option>
      </select>
      <p class="format-hint">
        {#if $ordersFormat === 'json'}
          Example: <code>{`{"client":"Sabil","type":"Orders","code":"12234"}`}</code>
        {:else}
          Example: <code>12234</code>
        {/if}
      </p>
    </div>
  {/if}
  
  {#if isBox}
    <div class="format-switcher">
      <label for="box-format-select">
        <h5 class="label-text">QR Data Format:</h5>
      </label>
      <select 
        id="box-format-select" 
        class="format-select"
        bind:value={$boxFormat}
        on:change={handleBoxFormatChange}
      >
        <option value="json">JSON (with client & type info)</option>
        <option value="raw">Raw Text (code only)</option>
      </select>
      <p class="format-hint">
        {#if $boxFormat === 'json'}
          Example: <code>{`{"client":"Sabil","type":"Box","code":"BX100BN"}`}</code>
        {:else}
          Example: <code>BX100BN</code>
        {/if}
      </p>
    </div>
    
    <div id="box-layout-switcher">
      <label for="box-layout-select">
        <h5 class="label-text">Print Layout:</h5>
      </label>
      <select 
        id="box-layout-select" 
        class="layout-select"
        bind:value={$boxLayoutMode}
        on:change={handleBoxLayoutChange}
      >
        <option value="grid">Grid (3×2 - 6 per page)</option>
        <option value="single">Single (1 per page)</option>
      </select>
    </div>
  {/if}

  {#if isCustom}
    <div id="custom-layout-switcher">
      <label for="custom-layout-select">
        <h5 class="label-text">Print Layout:</h5>
      </label>
      <select 
        id="custom-layout-select" 
        class="layout-select"
        bind:value={$customLayoutMode}
        on:change={handleCustomLayoutChange}
      >
        <option value="grid">Grid (3×2 - 6 per page)</option>
        <option value="single">Single (1 per page)</option>
      </select>
    </div>

    <div id="custom-options-wrapper">
      <div class="custom-format-info">
        <p><strong>Custom Format:</strong> Prefix {$customIncludeDash ? '-' : ''} Number {$customIncludeDash ? '-' : ''} Suffix</p>
        <p class="format-example">Example: {$customIncludeDash ? 'A-111-C' : 'A111C'}</p>
      </div>
      <div class="custom-inputs-row">
        <div class="input-wrapper">
          <label for="custom-prefix">
            <h5 class="label-text">Prefix (optional)</h5>
          </label>
          <input 
            type="text" 
            id="custom-prefix" 
            bind:value={$customPrefix}
            placeholder="e.g., A, B, ABC" 
            maxlength="5" 
          />
        </div>
        <div class="input-wrapper">
          <label for="custom-suffix">
            <h5 class="label-text">Suffix (optional)</h5>
          </label>
          <input 
            type="text" 
            id="custom-suffix" 
            bind:value={$customSuffix}
            placeholder="e.g., A, C, XYZ" 
            maxlength="5" 
          />
        </div>
      </div>
      <div class="dash-toggle">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            bind:checked={$customIncludeDash}
          />
          <span>Include dash separator (-)</span>
        </label>
      </div>
    </div>
  {/if}

  <h2 style="text-align: center">Generated QR code Form</h2>
  
  <div class="input-wrapper">
    <label for="client-qr-code">
      <h5 class="label-text">
        Client QR code
        <span style="display: inline-block; color: red; padding: 5px">*read only</span>
      </h5>
    </label>
    <input
      type="text"
      id="client-qr-code"
      readonly
      value="Sabil"
      alt="readonly"
    />
  </div>

  <div class="input-wrapper">
    <label for="initial-serial-number">
      <h5 class="label-text">Initial serial number</h5>
    </label>
    <div id="serial-number-input-wrapper">
      <input 
        type="text" 
        id="initial-serial-number" 
        bind:value={$initialSerialNumber}
        required 
      />
      <button type="button" id="latest-code-btn" on:click={handleLatestCode}>
        Latest Code
      </button>
    </div>
  </div>

  <div class="input-wrapper">
    <label for="qty-code">
      <h5 class="label-text">Quantity</h5>
    </label>
    <input 
      type="number" 
      id="qty-code" 
      bind:value={$qtyCode}
    />
  </div>

  {#if !isBox && !isCustom}
    <div id="number-of-pages-wrapper" class="input-wrapper">
      <label for="number-of-pages-code">
        <h5 class="label-text">Number of page</h5>
      </label>
      <input 
        type="number" 
        id="number-of-pages-code" 
        bind:value={$numberOfPages}
        on:keydown={handleNumberOfPagesInput}
      />
    </div>
  {/if}

  {#if isBox}
    <div id="suffix-qr-code-wrapper" class="input-wrapper">
      <label for="suffix-qr-code">
        <h5 class="label-text">Suffix</h5>
      </label>
      <select id="suffix-qr-code" bind:value={$boxSuffix}>
        {#each boxSuffixOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
  {/if}

  <input type="submit" id="generate-button" value="Generate" />
</form>

