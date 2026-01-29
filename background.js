// Background script for context menu and keyboard shortcuts
// Note: Service workers cannot use ES6 imports directly
// We'll use inline database operations instead

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed, creating context menu...');
  
  // Context menu for links
  chrome.contextMenus.create({
    id: 'saveBookmark',
    title: 'Save Link as Bookmark',
    contexts: ['link']
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Context menu creation error (link):', chrome.runtime.lastError);
    } else {
      console.log('Context menu for links created successfully');
    }
  });
  
  // Context menu for page
  chrome.contextMenus.create({
    id: 'saveCurrentPage',
    title: 'Save This Page as Bookmark',
    contexts: ['page']
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Context menu creation error (page):', chrome.runtime.lastError);
    } else {
      console.log('Context menu for page created successfully');
    }
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'saveBookmark') {
    // Open popup with link URL pre-filled
    chrome.action.openPopup();
    // Send message to popup with URL info
    setTimeout(() => {
      chrome.runtime.sendMessage({ 
        action: 'openSaveModal', 
        url: info.linkUrl,
        title: info.linkUrl.split('/').pop() || 'Bookmark'
      });
    }, 100);
  } else if (info.menuItemId === 'saveCurrentPage') {
    // Open popup with current page pre-filled
    chrome.action.openPopup();
    setTimeout(() => {
      chrome.runtime.sendMessage({ 
        action: 'openSaveModal', 
        url: tab.url,
        title: tab.title
      });
    }, 100);
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'save-bookmark') {
    // Get the currently focused link from content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Check if we can send messages to the content script
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getFocusedLink' });
      if (response && response.url) {
        await saveBookmark(response.url, tab);
      } else {
        // Save the current page URL if no link is focused
        await saveBookmark(tab.url, tab);
      }
    } catch (error) {
      // Content script not loaded or error occurred, save current page
      await saveBookmark(tab.url, tab);
    }
  }
});

// Listen for messages from popup to save current page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveCurrentPage') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      const metadata = request.metadata || {};
      await saveBookmark(tab.url, tab, metadata);
      sendResponse({ success: true });
    });
    return true; // Keep message channel open for async response
  }
});

// Save bookmark to IndexedDB
async function saveBookmark(url, tab, metadata = {}) {
  console.log('Attempting to save bookmark:', url);
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1) || tab.title || 'index';
    const domain = urlObj.hostname;
    const extension = getFileExtension(pathname);
    
    const bookmark = {
      url: url,
      filename: metadata.title || filename,
      domain: domain,
      fileType: extension,
      title: metadata.title || tab.title || filename,
      dateAdded: Date.now(),
      usageCount: 0,
      tags: metadata.tags || [],
      favorite: false,
      notes: '',
      folder: metadata.folder || null
    };

    console.log('Bookmark object:', bookmark);

    // Initialize database connection
    const db = await openDatabase();
    console.log('Database opened successfully');
    
    // Check for duplicates
    const isDuplicate = await checkDuplicate(db, url);
    console.log('Duplicate check result:', isDuplicate);
    
    if (isDuplicate) {
      // Show notification for duplicate
      console.log('Bookmark is duplicate, showing notification');
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Duplicate Bookmark',
        message: 'This bookmark already exists in your collection.'
      });
      return;
    }

    await addBookmark(db, bookmark);
    console.log('Bookmark added successfully');
    
    // Show success notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Bookmark Saved',
      message: `Saved: ${filename}`
    });
  } catch (error) {
    console.error('Error saving bookmark:', error);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Error',
      message: 'Failed to save bookmark: ' + error.message
    });
  }
}

function getFileExtension(pathname) {
  const match = pathname.match(/\.([^./?#]+)(?:[?#]|$)/);
  return match ? match[1].toLowerCase() : 'page';
}

// IndexedDB helper functions
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BookmarkOrganizerDB', 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create bookmarks store if it doesn't exist
      if (!db.objectStoreNames.contains('bookmarks')) {
        const store = db.createObjectStore('bookmarks', { keyPath: 'id', autoIncrement: true });
        store.createIndex('url', 'url', { unique: true });
        store.createIndex('filename', 'filename');
        store.createIndex('domain', 'domain');
        store.createIndex('fileType', 'fileType');
        store.createIndex('dateAdded', 'dateAdded');
        store.createIndex('favorite', 'favorite');
        store.createIndex('folder', 'folder');
      }
      
      // Create settings store if it doesn't exist
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
      
      // Upgrade existing bookmarks if needed (v1 to v2)
      if (event.oldVersion < 2 && db.objectStoreNames.contains('bookmarks')) {
        const transaction = event.target.transaction;
        const store = transaction.objectStore('bookmarks');
        
        store.openCursor().onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            const bookmark = cursor.value;
            if (!bookmark.hasOwnProperty('favorite')) {
              bookmark.favorite = false;
            }
            if (!bookmark.hasOwnProperty('notes')) {
              bookmark.notes = '';
            }
            if (!bookmark.hasOwnProperty('folder')) {
              bookmark.folder = null;
            }
            cursor.update(bookmark);
            cursor.continue();
          }
        };
      }
    };
  });
}

function checkDuplicate(db, url) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bookmarks'], 'readonly');
    const store = transaction.objectStore('bookmarks');
    const index = store.index('url');
    const request = index.get(url);
    
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject(request.error);
  });
}

function addBookmark(db, bookmark) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bookmarks'], 'readwrite');
    const store = transaction.objectStore('bookmarks');
    const request = store.add(bookmark);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
