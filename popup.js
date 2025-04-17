const delayRange = document.getElementById("delayRange");
const valueDisplay = document.getElementById("valueDisplay");
const toggleEnable = document.getElementById("toggleEnable");

chrome.storage.sync.get(["delaySeconds", "extensionEnabled"], (data) => {
  delayRange.value = data.delaySeconds || 5;
  valueDisplay.textContent = `${delayRange.value}s`;
  toggleEnable.checked = data.extensionEnabled !== false; // default to true
});

delayRange.addEventListener("input", () => {
  const value = parseInt(delayRange.value, 10);
  valueDisplay.textContent = `${value}s`;
  chrome.storage.sync.set({ delaySeconds: value });
});

toggleEnable.addEventListener("change", () => {
  chrome.storage.sync.set({ extensionEnabled: toggleEnable.checked });
});
