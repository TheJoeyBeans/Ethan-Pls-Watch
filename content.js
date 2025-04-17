let minimumPlayTime = 5;
let extensionEnabled = true;
let playStartTime = null;
let video;

function setupBlocker() {
  video = document.querySelector("video");
  if (!video) return;

  // Get initial values from storage
  chrome.storage.sync.get(["delaySeconds", "extensionEnabled"], (data) => {
    if (data.delaySeconds) minimumPlayTime = data.delaySeconds;
    extensionEnabled = data.extensionEnabled !== false;
  });

  video.addEventListener("play", () => {
    if (playStartTime === null) {
      playStartTime = Date.now();
    }
  });

  video.addEventListener("pause", () => {
    if (!extensionEnabled) return;

    const elapsed = (Date.now() - playStartTime) / 1000;
    if (elapsed < minimumPlayTime) {
      video.play();
    }
    if (elapsed >= minimumPlayTime) {
      playStartTime = null; // Reset the timer
    }
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.delaySeconds) minimumPlayTime = changes.delaySeconds.newValue;
    if (changes.extensionEnabled !== undefined)
      extensionEnabled = changes.extensionEnabled.newValue;
  });
}

// Watch for new <video> elements (YouTube SPA navigation)
const observer = new MutationObserver(() => {
  const vid = document.querySelector("video");
  if (vid && vid !== video) {
    setupBlocker();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
