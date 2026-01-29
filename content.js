// Content script for handling focused link detection
let focusedLink = null;

// Track the last hovered link
document.addEventListener('mouseover', (e) => {
  if (e.target.tagName === 'A' && e.target.href) {
    focusedLink = e.target.href;
  }
}, true);

document.addEventListener('mouseout', (e) => {
  if (e.target.tagName === 'A') {
    focusedLink = null;
  }
}, true);

// Also track right-clicked links
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'A' && e.target.href) {
    focusedLink = e.target.href;
  }
}, true);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getFocusedLink') {
    sendResponse({ url: focusedLink });
  }
  return true;
});
