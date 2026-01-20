<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import {
    qrType,
    baseUrl,
    qrCodeList,
    qrPage,
    lastItemPage,
    isGenerated,
    showLoadingIndicator,
    alertMessage,
    isOfflineMode,
    boxLayoutMode,
    customLayoutMode,
    ordersFormat,
    boxFormat,
    initialSerialNumber,
    qtyCode,
    numberOfPages,
    customPrefix,
    customSuffix,
    boxSuffix,
    showAllPages
  } from './stores';
  import { setBaseUrl, loadFromStorage, saveToStorage } from './lib/utils';
  import { saveGeneratedRangeHistory } from './lib/api';
  import { 
    getQRCodeTextContent, 
    generateQRCodeDataURL, 
    getQRCodeSize,
    createQRBoxData,
    createQROrdersData,
    createQRCustomData
  } from './lib/qrGenerator';
  import { CONFIG } from './lib/constants';
  
  import Header from './lib/components/Header.svelte';
  import History from './lib/components/History.svelte';
  import QRForm from './lib/components/QRForm.svelte';
  import AlertMessage from './lib/components/AlertMessage.svelte';
  import LoadingIndicator from './lib/components/LoadingIndicator.svelte';
  import QRDisplay from './lib/components/QRDisplay.svelte';

  let generatedQRCodes = [];

  async function generateQRCodes(saveHistory = true) {
    const nop = get(numberOfPages);
    const qty = nop && !isNaN(+nop) && +nop > 0 
      ? +nop * CONFIG.QR_CODES_PER_PAGE 
      : +get(qtyCode);

    if (qty <= 0) return;

    // Reset "Show all" button to default state
    showAllPages.set(false);

    generatedQRCodes = [];
    qrCodeList.set([]);
    qrPage.set([]);
    lastItemPage.set(0);

    let initial = get(initialSerialNumber) ?? "";
    
    if (typeof initial !== "string" || initial.trim().length === 0) return;
    if (isNaN(Number(initial.trim()))) {
      console.log("Invalid initial serial number");
      return;
    }

    const initialNumber = +initial.trim();
    isGenerated.set(true);
    showLoadingIndicator.set(true);

    const currentType = get(qrType);
    const typeLower = currentType.toLowerCase();
    const client = "Sabil";

    setTimeout(async () => {
      const codes = [];

      for (let i = 0; i < qty; i++) {
        try {
          const codeNumber = initialNumber + i;
          const text = getQRCodeTextContent(
            codeNumber.toString(),
            currentType,
            get(customPrefix).toUpperCase(),
            get(customSuffix).toUpperCase(),
            get(boxSuffix)
          );

          let data;
          if (typeLower === "orders") {
            data = createQROrdersData(codeNumber, currentType, client, get(ordersFormat));
          } else if (typeLower === "box") {
            data = createQRBoxData(codeNumber, currentType, client, get(boxSuffix), get(boxFormat));
          } else if (typeLower === "custom") {
            data = createQRCustomData(
              codeNumber,
              get(customPrefix).toUpperCase(),
              get(customSuffix).toUpperCase()
            );
          }

          const size = getQRCodeSize(currentType, get(customLayoutMode));
          const dataURL = await generateQRCodeDataURL(data, size);

          if (dataURL) {
            codes.push({
              id: codeNumber,
              text: text,
              dataURL: dataURL
            });
          }
        } catch (e) {
          console.error("Error generating QR code:", e);
        }
      }

      generatedQRCodes = codes;
      qrCodeList.set(codes);
      
      const firstPage = codes.slice(0, CONFIG.QR_CODES_PER_PAGE);
      qrPage.set(firstPage);
      lastItemPage.set(firstPage.length);

      if (saveHistory) {
        await saveQRCodesToHistory(initialNumber, qty);
      }

      showLoadingIndicator.set(false);
      isGenerated.set(false);
    }, 1000);
  }

  async function saveQRCodesToHistory(initNumber, qty) {
    if (get(isOfflineMode)) {
      alertMessage.set({
        message: "QR codes generated successfully! (Offline Mode - not saved to server)",
        type: "alert-success"
      });
      return;
    }

    const currentType = get(qrType);
    const typeLower = currentType.toLowerCase();
    
    let suffix = null;
    let prefix = null;
    
    if (typeLower === "box") {
      suffix = get(boxSuffix);
      prefix = "BX";
    } else if (typeLower === "custom") {
      suffix = get(customSuffix).toUpperCase() || null;
      prefix = get(customPrefix).toUpperCase() || null;
    }

    const result = await saveGeneratedRangeHistory(initNumber, qty, currentType, suffix, prefix);
    
    if (result != null) {
      alertMessage.set({ message: result.message, type: "alert-success" });
      console.log("Saved:", result.data);
    } else {
      alertMessage.set({
        message: "Invalid range history response from server",
        type: "alert-error"
      });
    }
  }

  async function handleHistoryItemClick() {
    await generateQRCodes(false);
  }

  // Print event handlers
  let wasShowingAll = false;
  
  function handleBeforePrint() {
    // Show all QR codes when printing (save current state)
    wasShowingAll = get(showAllPages);
    if (!wasShowingAll) {
      showAllPages.set(true);
    }
    
    const typeLower = get(qrType).toLowerCase();
    
    if (typeLower === "box" || typeLower === "custom") {
      const layoutMode = typeLower === "box" ? get(boxLayoutMode) : get(customLayoutMode);
      const layoutClass = `layout-${layoutMode}`;
      
      // Wait a tick for Svelte to render all codes
      setTimeout(() => {
        document.querySelectorAll(".qr-code-text").forEach((e) => {
          e.classList.add("qr-code-text-box");
        });
        document.querySelectorAll(".qr-code-item").forEach((e) => {
          e.classList.add("qr-code-item-box");
          e.classList.add(layoutClass);
        });
        document.querySelectorAll(".qr-code-wrapper img").forEach((e) => {
          e.parentElement.classList.remove("qr-code-wrapper");
          e.parentElement.classList.add("qr-code-wrapper-box");
        });
      }, 0);
    }
  }

  function handleAfterPrint() {
    // Restore previous show all state
    if (!wasShowingAll) {
      showAllPages.set(false);
    }
    
    document.querySelectorAll(".qr-code-text").forEach((e) => {
      e.classList.remove("qr-code-text-box");
    });
    document.querySelectorAll(".qr-code-item").forEach((e) => {
      e.classList.remove("qr-code-item-box");
      e.classList.remove("layout-grid");
      e.classList.remove("layout-single");
    });
    document.querySelectorAll(".qr-code-wrapper-box img").forEach((e) => {
      e.parentElement.classList.remove("qr-code-wrapper-box");
      e.parentElement.classList.add("qr-code-wrapper");
    });
  }

  onMount(() => {
    // Set base URL
    baseUrl.set(setBaseUrl());

    // Load preferences from localStorage
    const savedMode = loadFromStorage("qrGeneratorMode");
    if (savedMode === "offline") {
      isOfflineMode.set(true);
    }

    const savedBoxLayout = loadFromStorage("qrBoxLayoutMode");
    if (savedBoxLayout === "single" || savedBoxLayout === "grid") {
      boxLayoutMode.set(savedBoxLayout);
    }

    const savedCustomLayout = loadFromStorage("qrCustomLayoutMode");
    if (savedCustomLayout === "single" || savedCustomLayout === "grid") {
      customLayoutMode.set(savedCustomLayout);
    }

    const savedOrdersFormat = loadFromStorage("qrOrdersFormat");
    if (savedOrdersFormat === "json" || savedOrdersFormat === "raw") {
      ordersFormat.set(savedOrdersFormat);
    }

    const savedBoxFormat = loadFromStorage("qrBoxFormat");
    if (savedBoxFormat === "json" || savedBoxFormat === "raw") {
      boxFormat.set(savedBoxFormat);
    }

    // Register print event listeners
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  });
</script>

<Header />

<main>
  <History onHistoryItemClick={handleHistoryItemClick} />
  
  <hr style="margin: 25px" class="dont-print" />
  
  <div id="main-content">
    <QRForm onGenerate={generateQRCodes} />
    <AlertMessage />
    <LoadingIndicator />
    <QRDisplay qrCodes={generatedQRCodes} />
  </div>

  <br />
</main>

<style>
  :global(body) {
    background-color: #eee;
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  main {
    width: 100%;
  }

  #main-content {
    width: 85%;
    margin: auto;
  }
</style>

