<script>
  import { onMount } from 'svelte';
  import { 
    printOffsetTop, 
    printOffsetLeft,
    printRowOffset1,
    printRowOffset2,
    printRowOffset3,
    printColumnGap
  } from '../../stores';
  import { saveToStorage, loadFromStorage } from '../utils';

  let showRowControls = false;

  function handleOffsetChange() {
    saveToStorage('printOffsetTop', $printOffsetTop.toString());
    saveToStorage('printOffsetLeft', $printOffsetLeft.toString());
    saveToStorage('printColumnGap', $printColumnGap.toString());
    applyOffsets();
  }

  function handleRowOffsetChange() {
    saveToStorage('printRowOffset1', $printRowOffset1.toString());
    saveToStorage('printRowOffset2', $printRowOffset2.toString());
    saveToStorage('printRowOffset3', $printRowOffset3.toString());
    applyOffsets();
  }

  function applyOffsets() {
    // Global offsets
    document.documentElement.style.setProperty('--print-offset-top', `${$printOffsetTop}mm`);
    document.documentElement.style.setProperty('--print-offset-left', `${$printOffsetLeft}mm`);
    // Column gap
    document.documentElement.style.setProperty('--print-column-gap', `${$printColumnGap}mm`);
    // Per-row offsets
    document.documentElement.style.setProperty('--print-row1-offset', `${$printRowOffset1}mm`);
    document.documentElement.style.setProperty('--print-row2-offset', `${$printRowOffset2}mm`);
    document.documentElement.style.setProperty('--print-row3-offset', `${$printRowOffset3}mm`);
  }

  function reset() {
    printOffsetTop.set(0);
    printOffsetLeft.set(0);
    printColumnGap.set(0);
    printRowOffset1.set(0);
    printRowOffset2.set(0);
    printRowOffset3.set(0);
    handleOffsetChange();
    handleRowOffsetChange();
  }

  function toggleRowControls() {
    showRowControls = !showRowControls;
  }

  onMount(() => {
    // Load global offsets
    const savedTop = loadFromStorage('printOffsetTop');
    const savedLeft = loadFromStorage('printOffsetLeft');
    const savedColumnGap = loadFromStorage('printColumnGap');
    if (savedTop) printOffsetTop.set(parseFloat(savedTop));
    if (savedLeft) printOffsetLeft.set(parseFloat(savedLeft));
    if (savedColumnGap) printColumnGap.set(parseFloat(savedColumnGap));
    
    // Load per-row offsets
    const savedRow1 = loadFromStorage('printRowOffset1');
    const savedRow2 = loadFromStorage('printRowOffset2');
    const savedRow3 = loadFromStorage('printRowOffset3');
    if (savedRow1) printRowOffset1.set(parseFloat(savedRow1));
    if (savedRow2) printRowOffset2.set(parseFloat(savedRow2));
    if (savedRow3) printRowOffset3.set(parseFloat(savedRow3));
    
    applyOffsets();
  });
</script>

<div class="print-offset-controls dont-print">
  <h4>Print Position Adjustment</h4>
  
  <!-- Global Offsets -->
  <div class="offset-grid">
    <div class="offset-row">
      <label>
        <span>↕ Vertical (mm):</span>
        <input 
          type="number" 
          bind:value={$printOffsetTop} 
          on:change={handleOffsetChange}
          step="1"
        />
      </label>
    </div>
    <div class="offset-row">
      <label>
        <span>↔ Horizontal (mm):</span>
        <input 
          type="number" 
          bind:value={$printOffsetLeft} 
          on:change={handleOffsetChange}
          step="1"
        />
      </label>
    </div>
    <div class="offset-row">
      <label>
        <span>↔ Column Gap (mm):</span>
        <input 
          type="number" 
          bind:value={$printColumnGap} 
          on:change={handleOffsetChange}
          step="1"
          min="0"
        />
      </label>
    </div>
  </div>

  <!-- Per-Row Spacing Toggle -->
  <button type="button" class="toggle-btn" on:click={toggleRowControls}>
    {showRowControls ? '▼' : '▶'} Row Spacing
  </button>

  <!-- Per-Row Offset Controls -->
  {#if showRowControls}
    <div class="row-offset-section">
      <p class="section-hint">Adjust each row independently (applies to all pages)</p>
      <div class="offset-grid">
        <div class="offset-row">
          <label>
            <span>Row 1 (mm):</span>
            <input 
              type="number" 
              bind:value={$printRowOffset1} 
              on:change={handleRowOffsetChange}
              step="1"
            />
          </label>
        </div>
        <div class="offset-row">
          <label>
            <span>Row 2 (mm):</span>
            <input 
              type="number" 
              bind:value={$printRowOffset2} 
              on:change={handleRowOffsetChange}
              step="1"
            />
          </label>
        </div>
        <div class="offset-row">
          <label>
            <span>Row 3 (mm):</span>
            <input 
              type="number" 
              bind:value={$printRowOffset3} 
              on:change={handleRowOffsetChange}
              step="1"
            />
          </label>
        </div>
      </div>
    </div>
  {/if}

  <button type="button" class="reset-btn" on:click={reset}>Reset All</button>
  <p class="hint">Negative = up/left, Positive = down/right</p>
</div>

<style>
  .print-offset-controls {
    max-width: 350px;
    margin: 50px 0 25px;
    padding: 16px;
    background-color: #e8f4e8;
    border: 2px solid #4caf50;
    border-radius: 8px;
    align-self: flex-start;
  }

  .print-offset-controls h4 {
    margin: 0 0 12px 0;
    color: #2e7d32;
  }

  .offset-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .offset-row label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .offset-row input {
    width: 80px;
    padding: 6px 8px;
    border: 1px solid #4caf50;
    border-radius: 4px;
  }

  .toggle-btn {
    margin-top: 12px;
    padding: 8px 12px;
    background-color: transparent;
    color: #2e7d32;
    border: 1px solid #4caf50;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    text-align: left;
  }

  .toggle-btn:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }

  .row-offset-section {
    margin-top: 12px;
    padding: 12px;
    background-color: rgba(76, 175, 80, 0.1);
    border-radius: 4px;
  }

  .section-hint {
    margin: 0 0 10px 0;
    font-size: 12px;
    color: #555;
  }

  .reset-btn {
    margin-top: 12px;
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .reset-btn:hover {
    background-color: #45a049;
  }

  .hint {
    margin: 8px 0 0;
    font-size: 12px;
    color: #666;
  }
</style>