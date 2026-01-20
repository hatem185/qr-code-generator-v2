/**
 * QR Code Generator Application
 * Organized and structured for better maintainability
 */

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

const CONFIG = {
  LIMIT_OF_NUMBER_PAGE: 16,
  QR_CODES_PER_PAGE: 6,
  HISTORY_ITEMS_PER_PAGE: 4,
  QR_SIZE_BOX: 500,
  QR_SIZE_ORDERS: 200,
  API_URLS: {
    LOCAL: "http://localhost:3000/api/qr-code-history",
    PRODUCTION: "https://dssystemqrcodehistory.onrender.com/api/qr-code-history"
  }
};

const QR_TYPES = {
  ORDERS: "Orders",
  BOX: "Box",
  CUSTOM: "Custom"
};

// ============================================================================
// DOM ELEMENTS REFERENCES
// ============================================================================

const DOM = {
  // Containers
  qrCodeContainer: document.getElementById("qr-code-container"),
  loadingIndicator: document.getElementById("loading-indicator"),
  alertMessage: document.getElementById("alert-message"),
  
  // Input Fields
  intialSerialNumber: document.getElementById("initial-serial-number"),
  qtyCode: document.getElementById("qty-code"),
  numberOfPages: document.getElementById("number-of-pages-code"),
  clientText: document.getElementById("client-qr-code"),
  typeQrCodeText: document.getElementById("type-qr-code"),
  suffixOption: document.getElementById("suffix-qr-code"),
  
  // Buttons
  generateBtn: document.getElementById("generate-button"),
  latestCodeBtn: document.getElementById("latest-code-btn"),
  showAllPagesBtn: document.getElementById("show-all-page"),
  ordersBtn: document.getElementById("orders-btn"),
  boxBtn: document.getElementById("box-btn"),
  customBtn: document.getElementById("custom-btn"),
  modeToggleBtn: document.getElementById("mode-toggle-btn"),
  
  // Navigation
  nextPage: document.getElementById("next-page"),
  prevPage: document.getElementById("prev-page"),
  qrPageSwitcher: document.getElementById("page-switcher"),
  
  // History
  historyListElement: document.getElementById("history-list"),
  prevHistoryPage: document.getElementById("prev-history-page"),
  nextHistoryPage: document.getElementById("next-history-page"),
  
  // Wrappers
  suffixOptionWrapper: document.getElementById("suffix-qr-code-wrapper"),
  numberOfPagesWrapper: document.getElementById("number-of-pages-wrapper"),
  boxLayoutSwitcher: document.getElementById("box-layout-switcher"),
  boxLayoutSelect: document.getElementById("box-layout-select"),
  customLayoutSwitcher: document.getElementById("custom-layout-switcher"),
  customLayoutSelect: document.getElementById("custom-layout-select"),
  customOptionsWrapper: document.getElementById("custom-options-wrapper"),
  customPrefix: document.getElementById("custom-prefix"),
  customSuffix: document.getElementById("custom-suffix")
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const State = {
  qrType: QR_TYPES.ORDERS,
  baseUrl: "",
  lastItemPage: 0,
  qrCodeList: [],
  qrPage: [],
  currentHistoryPage: 1,
  isGenerated: false,
  isOfflineMode: false,
  boxLayoutMode: "grid", // "grid" or "single"
  customLayoutMode: "grid", // "grid" or "single"
  qrHistoryData: {
    page: 1,
    fetchedLength: 0,
    data: []
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const Utils = {
  /**
   * Capitalizes the first letter of a string
   */
  capitalise(str = "") {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Formats a timestamp to readable date format
   */
  formatTimestamp(timestampString) {
    const dateObj = new Date(timestampString);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const hours = dateObj.getHours() === 0 ? 12 : dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const amPm = dateObj.getHours() >= 12 ? "PM" : "AM";
    
    return `${year}-${month}-${day} ${hours}:${minutes} ${amPm}`;
  },

  /**
   * Removes all child elements from a parent element
   */
  removeAllChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },

  /**
   * Sets the base URL based on the current environment
   */
  setBaseUrl() {
    const pageUrl = window.location.href;
    if (pageUrl.includes("localhost") || pageUrl.includes("127.0.0.1")) {
      State.baseUrl = CONFIG.API_URLS.LOCAL;
    } else {
      State.baseUrl = CONFIG.API_URLS.PRODUCTION;
    }
  }
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

const Validation = {
  /**
   * Validates the form inputs before generating QR codes
   */
  formValidation() {
    if (!(DOM.intialSerialNumber.value.trim().length > 0)) {
      UI.showAlertMessage("Please enter the initial Serial Number", "alert-error");
      return false;
    }
    
    const qty = +DOM.qtyCode.value;
    const nop = +DOM.numberOfPages.value;
    
    if ((isNaN(qty) || qty <= 0) && (isNaN(nop) || nop <= 0)) {
      UI.showAlertMessage(
        "Please enter valid quantity of page of numbers",
        "alert-error"
      );
      return false;
    }
    
    return true;
  }
};

// ============================================================================
// UI MANIPULATION FUNCTIONS
// ============================================================================

const UI = {
  /**
   * Shows or hides the loading indicator
   */
  showLoadingIndicator(show) {
    DOM.loadingIndicator.classList.toggle("hidden", !show);
  },

  /**
   * Shows an alert message
   */
  showAlertMessage(message, type) {
    DOM.alertMessage.classList.remove("alert-error");
    DOM.alertMessage.classList.remove("alert-success");
    DOM.alertMessage.textContent = message;
    DOM.alertMessage.classList.add(type);
    DOM.alertMessage.classList.remove("hidden");
  },

  /**
   * Hides the alert message
   */
  hideAlertMessage() {
    DOM.alertMessage.classList.add("hidden");
  },

  /**
   * Toggle between online and offline mode
   */
  toggleMode() {
    State.isOfflineMode = !State.isOfflineMode;
    
    if (State.isOfflineMode) {
      DOM.modeToggleBtn.classList.remove("online");
      DOM.modeToggleBtn.classList.add("offline");
      DOM.modeToggleBtn.querySelector(".mode-text").textContent = "Offline Mode";
      UI.showAlertMessage(
        "Offline Mode: API features are disabled. You can still generate QR codes.",
        "alert-success"
      );
    } else {
      DOM.modeToggleBtn.classList.remove("offline");
      DOM.modeToggleBtn.classList.add("online");
      DOM.modeToggleBtn.querySelector(".mode-text").textContent = "Online Mode";
      UI.hideAlertMessage();
    }
    
    // Save preference to localStorage
    localStorage.setItem("qrGeneratorMode", State.isOfflineMode ? "offline" : "online");
  },

  /**
   * Load mode preference from localStorage
   */
  loadModePreference() {
    const savedMode = localStorage.getItem("qrGeneratorMode");
    if (savedMode === "offline") {
      State.isOfflineMode = true;
      DOM.modeToggleBtn.classList.remove("online");
      DOM.modeToggleBtn.classList.add("offline");
      DOM.modeToggleBtn.querySelector(".mode-text").textContent = "Offline Mode";
    }
  },

  /**
   * Updates UI elements based on selected QR type
   */
  selectQrType(firstBtn, secondBtn, thirdBtn, type = "") {
    State.qrType = type;
    const typeLower = State.qrType.toLowerCase();
    
    // Show/hide appropriate options based on type
    DOM.suffixOptionWrapper.classList.toggle(
      "hidden",
      typeLower !== "box"
    );
    DOM.numberOfPagesWrapper.classList.toggle(
      "hidden",
      typeLower === "box" || typeLower === "custom"
    );
    DOM.boxLayoutSwitcher.classList.toggle(
      "hidden",
      typeLower !== "box"
    );
    DOM.customLayoutSwitcher.classList.toggle(
      "hidden",
      typeLower !== "custom"
    );
    DOM.customOptionsWrapper.classList.toggle(
      "hidden",
      typeLower !== "custom"
    );
    
    // Update button states
    [DOM.ordersBtn, DOM.boxBtn, DOM.customBtn].forEach(btn => {
      btn.classList.remove("picked-color");
    });
    
    if (typeLower === "orders") {
      DOM.ordersBtn.classList.add("picked-color");
    } else if (typeLower === "box") {
      DOM.boxBtn.classList.add("picked-color");
    } else if (typeLower === "custom") {
      DOM.customBtn.classList.add("picked-color");
    }
  },

  /**
   * Load box layout preference from localStorage
   */
  loadBoxLayoutPreference() {
    const savedLayout = localStorage.getItem("qrBoxLayoutMode");
    if (savedLayout === "single" || savedLayout === "grid") {
      State.boxLayoutMode = savedLayout;
      DOM.boxLayoutSelect.value = savedLayout;
    }
  },

  /**
   * Handle box layout change
   */
  handleBoxLayoutChange() {
    State.boxLayoutMode = DOM.boxLayoutSelect.value;
    localStorage.setItem("qrBoxLayoutMode", State.boxLayoutMode);
    console.log("Box layout mode changed to:", State.boxLayoutMode);
  },

  /**
   * Load custom layout preference from localStorage
   */
  loadCustomLayoutPreference() {
    const savedLayout = localStorage.getItem("qrCustomLayoutMode");
    if (savedLayout === "single" || savedLayout === "grid") {
      State.customLayoutMode = savedLayout;
      DOM.customLayoutSelect.value = savedLayout;
    }
  },

  /**
   * Handle custom layout change
   */
  handleCustomLayoutChange() {
    State.customLayoutMode = DOM.customLayoutSelect.value;
    localStorage.setItem("qrCustomLayoutMode", State.customLayoutMode);
    console.log("Custom layout mode changed to:", State.customLayoutMode);
  },

  /**
   * Creates a history card element
   */
  createHistoryCardElement(data) {
    const li = document.createElement("li");
    
    const qrTypeText = document.createElement("h3");
    qrTypeText.textContent = data.type;
    const typeLower = data.type?.toLowerCase();
    if (typeLower === "orders") {
      qrTypeText.style.color = "red";
    } else if (typeLower === "box") {
      qrTypeText.style.color = "green";
    } else if (typeLower === "custom") {
      qrTypeText.style.color = "#4a90e2";
    }
    
    const startCodeText = document.createElement("h4");
    startCodeText.textContent = `First code: ${data.first_code}`;
    
    const lastCodeText = document.createElement("h4");
    lastCodeText.textContent = `Last code: ${data.last_code}`;
    
    const createdAtText = document.createElement("h4");
    createdAtText.textContent = `Created At: ${Utils.formatTimestamp(data.createdAt)}`;
    
    li.append(qrTypeText, startCodeText, lastCodeText, createdAtText);
    li.classList.add("history-card");
    
    return li;
  },

  /**
   * Resets and updates the history list element
   */
  resetHistoryListElement(fromIndex, toIndex) {
    Utils.removeAllChildren(DOM.historyListElement);
    
    const elements = State.qrHistoryData.data.slice(fromIndex, toIndex).map((e) => {
      const li = UI.createHistoryCardElement(e);
      
      li.addEventListener("click", async () => {
        const value = window.prompt(
          "Please enter the starting code within the specified range for generation"
        );
        
        const typeLower = e.type.toLowerCase();
        if (typeLower === "box") {
          DOM.suffixOption.value = e.suffix;
          UI.selectQrType(DOM.boxBtn, DOM.ordersBtn, DOM.customBtn, QR_TYPES.BOX);
        } else if (typeLower === "orders") {
          UI.selectQrType(DOM.ordersBtn, DOM.boxBtn, DOM.customBtn, QR_TYPES.ORDERS);
        } else if (typeLower === "custom") {
          DOM.customPrefix.value = e.prefix || "";
          DOM.customSuffix.value = e.suffix || "";
          UI.selectQrType(DOM.customBtn, DOM.ordersBtn, DOM.boxBtn, QR_TYPES.CUSTOM);
        }
        
        if (value && +value > e.first_code && +value < e.first_code + e.qty_codes - 1) {
          DOM.intialSerialNumber.value = value;
          DOM.qtyCode.value = e.qty_codes - (+value - e.first_code);
        } else {
          DOM.intialSerialNumber.value = e.first_code;
          DOM.qtyCode.value = e.qty_codes;
        }
        
        await QRGenerator.generateQRCodes(false);
      });
      
      return li;
    });
    
    DOM.historyListElement.append(...elements);
  }
};
// ============================================================================
// QR CODE GENERATION FUNCTIONS
// ============================================================================

const QRGenerator = {
  /**
   * Gets the number of codes to generate based on input
   */
  getNumberOfGeneratedCode() {
    const nop = DOM.numberOfPages.value;
    const qty = DOM.qtyCode.value;
    
    if (nop && !isNaN(+nop) && +nop > 0) {
      return +nop * CONFIG.QR_CODES_PER_PAGE;
    } else if (+qty && !isNaN(+qty) && +qty > 0) {
      return +qty;
    }
    
    return 0;
  },

  /**
   * Generates the text content for QR code display
   */
  qrCodeTextContent(code = "") {
    const typeLower = State.qrType.toLowerCase();
    
    if (typeLower === "box") {
      return `BX${code}${DOM.suffixOption.value}`;
    } else if (typeLower === "custom") {
      const prefix = DOM.customPrefix.value.toUpperCase() || "";
      const suffix = DOM.customSuffix.value.toUpperCase() || "";
      
      // Build with dashes only where needed
      let result = code;
      if (prefix) {
        result = `${prefix}-${result}`;
      }
      if (suffix) {
        result = `${result}-${suffix}`;
      }
      return result;
    }
    
    return code;
  },

  /**
   * Creates QR data for Box type
   */
  qrBoxData(initialNumber, type) {
    const suffix = DOM.suffixOption.value;
    return JSON.stringify({
      client: DOM.clientText.value,
      type: type,
      code: `BX${initialNumber}${suffix.toUpperCase()}`
    });
  },

  /**
   * Creates QR data for Orders type
   */
  qrOrdersData(initialNumber, type) {
    return JSON.stringify({
      client: DOM.clientText.value,
      type: type,
      code: `${initialNumber}`
    });
  },

  /**
   * Creates QR data for Custom type (plain text, no JSON)
   */
  qrCustomData(initialNumber, type) {
    const prefix = DOM.customPrefix.value.toUpperCase() || "";
    const suffix = DOM.customSuffix.value.toUpperCase() || "";
    
    // Build with dashes only where needed
    let result = initialNumber.toString();
    if (prefix) {
      result = `${prefix}-${result}`;
    }
    if (suffix) {
      result = `${result}-${suffix}`;
    }
    
    // Return plain text only, no JSON
    return result;
  },

  /**
   * Creates QR code configuration
   */
  qrConfig(data) {
    const typeLower = State.qrType.toLowerCase();
    let size = CONFIG.QR_SIZE_ORDERS;
    
    if (typeLower === "box") {
      size = CONFIG.QR_SIZE_BOX;
    } else if (typeLower === "custom") {
      // Use size based on layout mode for custom type
      size = State.customLayoutMode === "single" ? CONFIG.QR_SIZE_BOX : CONFIG.QR_SIZE_ORDERS;
    }
    
    return {
      text: data,
      width: size,
      height: size,
      correctLevel: QRCode.CorrectLevel.H
    };
  },

  /**
   * Main function to generate QR codes
   */
  async generateQRCodes(saveHistory = true) {
    const qty = QRGenerator.getNumberOfGeneratedCode();
    if (qty <= 0) return;
    
    // Reset "Show all" button to default state
    DOM.showAllPagesBtn.textContent = "Show all";
    DOM.qrPageSwitcher.classList.remove("hidden");
    
    Utils.removeAllChildren(DOM.qrCodeContainer);
    State.qrCodeList = [];
    State.qrPage = [];
    State.lastItemPage = 0;
    
    let initial = DOM.intialSerialNumber.value ?? "";
    
    if (typeof initial !== "string" || initial.trim().length === 0) return;
    if (isNaN(Number(initial.trim()))) {
      console.log("Invalid initial serial number");
      return;
    }
    
    const initialNumber = +initial.trim();
    State.isGenerated = true;
    UI.showLoadingIndicator(true);
    
    const typeLower = State.qrType.toLowerCase();
    let qrData;
    if (typeLower === "orders") {
      qrData = QRGenerator.qrOrdersData;
    } else if (typeLower === "box") {
      qrData = QRGenerator.qrBoxData;
    } else if (typeLower === "custom") {
      qrData = QRGenerator.qrCustomData;
    } else {
      qrData = QRGenerator.qrOrdersData; // fallback
    }
    
    setTimeout(async () => {
      for (let i = 0; i < qty; i++) {
        try {
          const qrCodeItem = document.createElement("div");
          qrCodeItem.classList.add("qr-code-item");
          qrCodeItem.id = `qr-code-${initialNumber + i}`;
          
          const qrCodeText = document.createElement("h2");
          qrCodeText.classList.add("qr-code-text");
          qrCodeText.textContent = QRGenerator.qrCodeTextContent(
            (initialNumber + i).toString()
          );
          
          const qrCodeWrapper = document.createElement("div");
          qrCodeWrapper.classList.add("qr-code-wrapper");
          qrCodeWrapper.appendChild(qrCodeText);
          
          const data = qrData(initialNumber + i, State.qrType);
          new QRCode(qrCodeWrapper, QRGenerator.qrConfig(data));
          
          qrCodeItem.appendChild(qrCodeWrapper);
          State.qrCodeList.push(qrCodeItem);
        } catch (e) {
          console.error("Error generating QR code:", e);
        }
      }
      
      State.qrPage = State.qrCodeList.slice(0, CONFIG.QR_CODES_PER_PAGE);
      State.lastItemPage = State.qrPage.length;
      DOM.qrCodeContainer.append(...State.qrPage);
      
      if (saveHistory) {
        await API.saveGeneratedQrCodes(+DOM.intialSerialNumber.value, qty);
      }
      
      UI.showLoadingIndicator(false);
      
      if (State.qrCodeList.length > CONFIG.QR_CODES_PER_PAGE) {
        DOM.showAllPagesBtn.classList.remove("hidden");
        DOM.qrPageSwitcher.classList.remove("hidden");
      } else {
        DOM.qrPageSwitcher.classList.add("hidden");
        DOM.showAllPagesBtn.classList.add("hidden");
      }
      
      State.isGenerated = false;
    }, 1000);
  }
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

const API = {
  /**
   * Creates data form for history
   */
  dataHistoryForm(initNumber, qty, type) {
    const typeLower = type.toLowerCase();
    const isQRBox = typeLower === "box";
    const isCustom = typeLower === "custom";
    
    return JSON.stringify({
      serial_number: initNumber,
      qty_codes: qty,
      printed_pages_number: 0,
      type: Utils.capitalise(type),
      suffix: isQRBox ? DOM.suffixOption.value : (isCustom ? DOM.customSuffix.value.toUpperCase() : null),
      prefix: isQRBox ? "BX" : (isCustom ? DOM.customPrefix.value.toUpperCase() : null)
    });
  },

  /**
   * Fetches history data from the server
   */
  async fetchHistories(page = 1, limit = CONFIG.LIMIT_OF_NUMBER_PAGE) {
    if (State.isOfflineMode) {
      console.log("Offline mode: Skipping history fetch");
      return null;
    }
    
    try {
      const response = await fetch(
        `${State.baseUrl}/histories?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching histories:", error);
      UI.showAlertMessage(
        "Failed to fetch history. Click the mode toggle to enable Offline Mode.",
        "alert-error"
      );
      return null;
    }
  },

  /**
   * Loads histories into state
   */
  async loadHistories(page) {
    const result = await API.fetchHistories(page);
    if (result) {
      State.qrHistoryData.fetchedLength = result.fetchedLength;
      State.qrHistoryData.page = result.page;
      State.qrHistoryData.data.push(...result.data);
    }
  },

  /**
   * Gets the latest code from history
   */
  async getLatestCode() {
    if (State.isOfflineMode) {
      UI.showAlertMessage(
        "Offline Mode: Cannot fetch latest code from server. Please enter manually.",
        "alert-error"
      );
      return {
        message: "Offline mode",
        latestCode: -1
      };
    }
    
    try {
      const response = await fetch(
        `${State.baseUrl}/latest-code-history?type=${State.qrType}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting latest code:", error);
      UI.showAlertMessage(
        "Failed to fetch latest code. Click the mode toggle to enable Offline Mode.",
        "alert-error"
      );
      return {
        message: error,
        latestCode: -1
      };
    }
  },

  /**
   * Checks if a range exists in history
   */
  async checkRangeInHistory() {
    if (State.isOfflineMode) {
      console.log("Offline mode: Skipping range check");
      return {
        message: "Offline mode - range check skipped",
        exists: "not_exists"
      };
    }
    
    const qty = QRGenerator.getNumberOfGeneratedCode();
    
    try {
      const response = await fetch(
        `${State.baseUrl}/check-range-in-history?serial_number=${+DOM.intialSerialNumber.value}&qty_codes=${qty}&type=${State.qrType}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error checking range:", error);
      UI.showAlertMessage(
        "Failed to check range. Click the mode toggle to enable Offline Mode.",
        "alert-error"
      );
      return {
        message: error.toString(),
        exists: "not_exists"
      };
    }
  },

  /**
   * Saves generated QR codes to history
   */
  async saveGeneratedQrCodes(initNumber, qty = 0) {
    if (State.isOfflineMode) {
      console.log("Offline mode: Skipping history save");
      UI.showAlertMessage(
        "QR codes generated successfully! (Offline Mode - not saved to server)",
        "alert-success"
      );
      return;
    }
    
    const result = await API.saveGeneratedRangeHistory(initNumber, qty);
    
    if (result != null) {
      UI.showAlertMessage(result.message, "alert-success");
      console.log("Saved:", result.data);
    } else {
      UI.showAlertMessage(
        "Invalid range history response from server",
        "alert-error"
      );
      console.log("Invalid range history response from server");
    }
  },

  /**
   * Saves generated range to history
   */
  async saveGeneratedRangeHistory(initNumber, qty = 0) {
    if (State.isOfflineMode) {
      console.log("Offline mode: Skipping history save");
      return null;
    }
    
    try {
      const dataForm = API.dataHistoryForm(initNumber, qty, State.qrType);
      console.log("Saving range history:", dataForm);
      
      const response = await fetch(`${State.baseUrl}/history`, {
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
      UI.showAlertMessage(
        "Failed to save to history. Click the mode toggle to enable Offline Mode.",
        "alert-error"
      );
    }
    
    return null;
  }
};

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const EventHandlers = {
  /**
   * Handle generate button click
   */
  async handleGenerate(e) {
    e.preventDefault();
    UI.hideAlertMessage();
    
    if (!Validation.formValidation()) return;
    if (State.isGenerated) return;
    
    const resultChecking = await API.checkRangeInHistory();
    console.log(resultChecking.message);
    
    if (resultChecking.exists === "not_exists") {
      await QRGenerator.generateQRCodes();
      return;
    }
    
    UI.showAlertMessage(resultChecking.message, "alert-error");
  },

  /**
   * Handle latest code button click
   */
  async handleLatestCode() {
    if (State.isGenerated) return;
    
    UI.showLoadingIndicator(true);
    const result = await API.getLatestCode();
    UI.showLoadingIndicator(false);
    
    if (result?.latestCode != -1) {
      DOM.intialSerialNumber.value = +result.latestCode + 1;
    }
  },

  /**
   * Handle show all pages button click
   */
  async handleShowAllPages() {
    const isShowingAll = DOM.showAllPagesBtn.textContent.trim().toLowerCase() === "show all";
    DOM.showAllPagesBtn.textContent = isShowingAll ? "Hide all" : "Show all";
    DOM.qrPageSwitcher.classList.toggle("hidden", isShowingAll);
    
    if (isShowingAll) {
      Utils.removeAllChildren(DOM.qrCodeContainer);
      DOM.qrCodeContainer.append(...State.qrCodeList);
    } else {
      Utils.removeAllChildren(DOM.qrCodeContainer);
      DOM.qrCodeContainer.append(...State.qrPage);
    }
  },

  /**
   * Handle next page button click
   */
  async handleNextPage(e) {
    e.preventDefault();
    
    if (State.qrCodeList.length <= State.lastItemPage) return;
    
    Utils.removeAllChildren(DOM.qrCodeContainer);
    State.qrPage = State.qrCodeList.slice(State.lastItemPage, State.lastItemPage + CONFIG.QR_CODES_PER_PAGE);
    DOM.qrCodeContainer.append(...State.qrPage);
    State.lastItemPage += State.qrPage.length;
  },

  /**
   * Handle previous page button click
   */
  async handlePrevPage(e) {
    e.preventDefault();
    
    if (State.lastItemPage <= CONFIG.QR_CODES_PER_PAGE) return;
    
    State.lastItemPage -= State.qrPage.length;
    Utils.removeAllChildren(DOM.qrCodeContainer);
    State.qrPage = State.qrCodeList.slice(State.lastItemPage - CONFIG.QR_CODES_PER_PAGE, State.lastItemPage);
    DOM.qrCodeContainer.append(...State.qrPage);
  },

  /**
   * Handle next history page button click
   */
  async handleNextHistoryPage() {
    const fromIndex = State.currentHistoryPage * CONFIG.HISTORY_ITEMS_PER_PAGE;
    
    if (State.qrHistoryData.data.length > fromIndex) {
      UI.resetHistoryListElement(fromIndex, fromIndex + CONFIG.HISTORY_ITEMS_PER_PAGE);
      State.currentHistoryPage += 1;
    } else if (
      fromIndex >= State.qrHistoryData.data.length &&
      State.qrHistoryData.fetchedLength === CONFIG.LIMIT_OF_NUMBER_PAGE
    ) {
      await API.loadHistories(State.qrHistoryData.page + 1);
      if (State.qrHistoryData.data.length > fromIndex) {
        UI.resetHistoryListElement(fromIndex, fromIndex + CONFIG.HISTORY_ITEMS_PER_PAGE);
        State.currentHistoryPage += 1;
      }
    } else {
      State.currentHistoryPage = 1;
      State.qrHistoryData.data = [];
      await API.loadHistories(1);
      UI.resetHistoryListElement(0, CONFIG.HISTORY_ITEMS_PER_PAGE);
    }
  },

  /**
   * Handle previous history page button click
   */
  async handlePrevHistoryPage(e) {
    e.preventDefault();
    
    if (State.currentHistoryPage === 1) return;
    
    State.currentHistoryPage--;
    const lastItemIndex = State.currentHistoryPage * CONFIG.HISTORY_ITEMS_PER_PAGE;
    UI.resetHistoryListElement(lastItemIndex - CONFIG.HISTORY_ITEMS_PER_PAGE, lastItemIndex);
  },

  /**
   * Handle orders button click
   */
  handleOrdersButton() {
    UI.selectQrType(DOM.ordersBtn, DOM.boxBtn, DOM.customBtn, QR_TYPES.ORDERS);
  },

  /**
   * Handle box button click
   */
  handleBoxButton() {
    UI.selectQrType(DOM.boxBtn, DOM.ordersBtn, DOM.customBtn, QR_TYPES.BOX);
  },

  /**
   * Handle custom button click
   */
  handleCustomButton() {
    UI.selectQrType(DOM.customBtn, DOM.ordersBtn, DOM.boxBtn, QR_TYPES.CUSTOM);
  },

  /**
   * Handle number of pages input
   */
  handleNumberOfPagesInput(e) {
    DOM.qtyCode.value = 0;
  },

  /**
   * Handle before print event
   */
  handleBeforePrint() {
    const typeLower = State.qrType.toLowerCase();
    
    if (typeLower === "box") {
      const layoutClass = `layout-${State.boxLayoutMode}`;
      
      [...document.getElementsByClassName("qr-code-text")].forEach((e) => {
        e.classList.add("qr-code-text-box");
      });
      [...document.getElementsByClassName("qr-code-item")].forEach((e) => {
        e.classList.add("qr-code-item-box");
        e.classList.add(layoutClass);
      });
      document.querySelectorAll(".qr-code-wrapper img").forEach((e) => {
        e.parentElement.classList.remove("qr-code-wrapper");
        e.parentElement.classList.add("qr-code-wrapper-box");
      });
    } else if (typeLower === "custom") {
      const layoutClass = `layout-${State.customLayoutMode}`;
      
      [...document.getElementsByClassName("qr-code-text")].forEach((e) => {
        e.classList.add("qr-code-text-box");
      });
      [...document.getElementsByClassName("qr-code-item")].forEach((e) => {
        e.classList.add("qr-code-item-box");
        e.classList.add(layoutClass);
      });
      document.querySelectorAll(".qr-code-wrapper img").forEach((e) => {
        e.parentElement.classList.remove("qr-code-wrapper");
        e.parentElement.classList.add("qr-code-wrapper-box");
      });
    }
  },

  /**
   * Handle after print event
   */
  handleAfterPrint() {
    [...document.getElementsByClassName("qr-code-text")].forEach((e) => {
      e.classList.remove("qr-code-text-box");
    });
    [...document.getElementsByClassName("qr-code-item")].forEach((e) => {
      e.classList.remove("qr-code-item-box");
      e.classList.remove("layout-grid");
      e.classList.remove("layout-single");
    });
    document.querySelectorAll(".qr-code-wrapper-box img").forEach((e) => {
      e.parentElement.classList.remove("qr-code-wrapper-box");
      e.parentElement.classList.add("qr-code-wrapper");
    });
  },

  /**
   * Handle mode toggle button click
   */
  handleModeToggle() {
    UI.toggleMode();
  }
};

// ============================================================================
// EVENT LISTENERS REGISTRATION
// ============================================================================

function registerEventListeners() {
  // Window events
  window.addEventListener("beforeprint", EventHandlers.handleBeforePrint);
  window.addEventListener("afterprint", EventHandlers.handleAfterPrint);
  
  // Button events
  DOM.generateBtn.addEventListener("click", EventHandlers.handleGenerate);
  DOM.latestCodeBtn.addEventListener("click", EventHandlers.handleLatestCode);
  DOM.showAllPagesBtn.addEventListener("click", EventHandlers.handleShowAllPages);
  DOM.ordersBtn.addEventListener("click", EventHandlers.handleOrdersButton);
  DOM.boxBtn.addEventListener("click", EventHandlers.handleBoxButton);
  DOM.customBtn.addEventListener("click", EventHandlers.handleCustomButton);
  DOM.modeToggleBtn.addEventListener("click", EventHandlers.handleModeToggle);
  
  // Navigation events
  DOM.nextPage.addEventListener("click", EventHandlers.handleNextPage);
  DOM.prevPage.addEventListener("click", EventHandlers.handlePrevPage);
  
  // History navigation events
  DOM.nextHistoryPage.addEventListener("click", EventHandlers.handleNextHistoryPage);
  DOM.prevHistoryPage.addEventListener("click", EventHandlers.handlePrevHistoryPage);
  
  // Input events
  DOM.numberOfPages.addEventListener("keydown", EventHandlers.handleNumberOfPagesInput);
  
  // Layout change events
  DOM.boxLayoutSelect.addEventListener("change", UI.handleBoxLayoutChange);
  DOM.customLayoutSelect.addEventListener("change", UI.handleCustomLayoutChange);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

async function initialize() {
  console.log("Initializing QR Code Generator...");
  
  // Set base URL
  Utils.setBaseUrl();
  
  // Load preferences from localStorage
  UI.loadModePreference();
  UI.loadBoxLayoutPreference();
  UI.loadCustomLayoutPreference();
  
  // Register event listeners
  registerEventListeners();
  
  // Load initial history (only if online mode)
  if (!State.isOfflineMode) {
    await API.loadHistories(1);
    UI.resetHistoryListElement(0, CONFIG.HISTORY_ITEMS_PER_PAGE);
  } else {
    console.log("Offline mode: Skipping initial history load");
  }
  
  console.log("QR Code Generator initialized successfully");
}

// Start the application
initialize();
