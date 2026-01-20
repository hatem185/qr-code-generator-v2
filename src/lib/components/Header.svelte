<script>
  import { isOfflineMode } from '../../stores';
  import { saveToStorage } from '../utils';

  function toggleMode() {
    isOfflineMode.update(val => !val);
    saveToStorage("qrGeneratorMode", $isOfflineMode ? "offline" : "online");
  }

  $: modeText = $isOfflineMode ? "Offline Mode" : "Online Mode";
  $: modeClass = $isOfflineMode ? "offline" : "online";
</script>

<header class="dont-print">
  <img
    src="/imgs/ds-logo.png"
    id="ds-logo"
    alt="ds-logo"
    class="dont-print"
  />
  <h1 class="page-title">QR Code Generator</h1>
  <div id="mode-toggle-container">
    <button 
      id="mode-toggle-btn" 
      class="mode-toggle-btn {modeClass}" 
      type="button"
      on:click={toggleMode}
    >
      <span class="mode-status">●</span>
      <span class="mode-text">{modeText}</span>
    </button>
  </div>
</header>

<style>
  header {
    padding: 16px;
    background-color: rgb(210, 68, 68);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
  }

  .page-title {
    color: white;
    flex: 1;
  }

  #mode-toggle-container {
    margin-left: auto;
  }

  .mode-toggle-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 2px solid white;
    border-radius: 20px;
    background-color: transparent;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .mode-toggle-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .mode-toggle-btn.online .mode-status {
    color: #4fe045;
    animation: pulse 2s infinite;
  }

  .mode-toggle-btn.offline .mode-status {
    color: #ff6b6b;
  }

  .mode-toggle-btn.offline {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  #ds-logo {
    display: block;
    width: 45px;
    height: 45px;
    background-color: white;
    border: 3px solid white;
    border-radius: calc(45px / 2);
  }
</style>

