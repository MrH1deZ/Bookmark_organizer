// Enhanced Popup UI controller with all new features
import { BookmarkDB } from './db.js';

const db = new BookmarkDB();

// DOM elements - Basic
const searchInput = document.getElementById('searchInput');
const fileTypeFilter = document.getElementById('fileTypeFilter');
const folderFilter = document.getElementById('folderFilter');
const sortBy = document.getElementById('sortBy');
const bookmarksList = document.getElementById('bookmarksList');
const bookmarksContainer = document.getElementById('bookmarksContainer');
const emptyState = document.getElementById('emptyState');
const bookmarkCount = document.getElementById('bookmarkCount');
const selectedCount = document.getElementById('selectedCount');

// DOM elements - Action buttons
const saveCurrentPageBtn = document.getElementById('saveCurrentPageBtn');
const manageFoldersBtn = document.getElementById('manageFoldersBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
// const clearBtn = document.getElementById('clearBtn');
const fileInput = document.getElementById('fileInput');
const statsBtn = document.getElementById('statsBtn');
const settingsBtn = document.getElementById('settingsBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleBulkMode = document.getElementById('toggleBulkMode');

// DOM elements - Advanced search
const advancedSearchBtn = document.getElementById('advancedSearchBtn');
const advancedSearchPanel = document.getElementById('advancedSearchPanel');
const useRegex = document.getElementById('useRegex');
const favoritesOnly = document.getElementById('favoritesOnly');
const dateFrom = document.getElementById('dateFrom');
const dateTo = document.getElementById('dateTo');
const usageMin = document.getElementById('usageMin');
const usageMax = document.getElementById('usageMax');

// DOM elements - Bulk operations
const bulkActions = document.getElementById('bulkActions');
const bulkSelectAll = document.getElementById('bulkSelectAll');
const bulkDeselectAll = document.getElementById('bulkDeselectAll');
const bulkDelete = document.getElementById('bulkDelete');
const bulkAddTag = document.getElementById('bulkAddTag');
const bulkSetFolder = document.getElementById('bulkSetFolder');
const bulkExport = document.getElementById('bulkExport');

// DOM elements - Modals
const editModal = document.getElementById('editModal');
const statsModal = document.getElementById('statsModal');
const settingsModal = document.getElementById('settingsModal');
const foldersModal = document.getElementById('foldersModal');
const saveBookmarkModal = document.getElementById('saveBookmarkModal');
const newFolderInput = document.getElementById('newFolderInput');
const createFolderBtn = document.getElementById('createFolderBtn');
const foldersListContainer = document.getElementById('foldersListDisplay');
const saveTitle = document.getElementById('saveTitle');
const saveFolderSelect = document.getElementById('saveFolderSelect');
const saveTags = document.getElementById('saveTags');
const confirmSave = document.getElementById('confirmSave');

// State
let allBookmarks = [];
let filteredBookmarks = [];
let currentFilters = {
  search: '',
  fileType: '',
  folder: undefined,
  tags: [],
  sort: 'dateAdded',
  useRegex: false,
  favoritesOnly: false,
  dateFrom: null,
  dateTo: null,
  usageMin: undefined,
  usageMax: undefined
};

let bulkModeActive = false;
let selectedBookmarks = new Set();
let currentEditingBookmark = null;
let pendingBookmarkSave = null; // Store page info for saving with folder selection

// Initialize
async function init() {
  console.log('Initializing popup...');
  try {
    await db.init();
    console.log('Database initialized');
    
    // Load user settings
    await loadSettings();
    console.log('Settings loaded');
    
    // Load bookmarks
    await loadBookmarks();
    console.log('Bookmarks loaded');
    
    // Load folders for filters
    await loadFolders();
    console.log('Folders loaded');
    
    // Setup event listeners
    setupEventListeners();
    console.log('Event listeners setup complete');
    
    // Apply saved theme
    applyTheme();
    console.log('Theme applied');
    
    // Listen for messages from background script (context menu clicks)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'openSaveModal') {
        pendingBookmarkSave = {
          url: request.url,
          title: request.title
        };
        saveTitle.value = request.title;
        saveTags.value = '';
        loadFoldersToSaveModal();
        saveBookmarkModal.classList.remove('hidden');
      }
    });
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

// Load user settings
async function loadSettings() {
  const theme = await db.getSetting('theme', 'light');
  const defaultSort = await db.getSetting('defaultSort', 'dateAdded');
  
  document.body.dataset.theme = theme;
  currentFilters.sort = defaultSort;
  sortBy.value = defaultSort;
  
  updateDarkModeIcon();
}

// Apply theme
function applyTheme() {
  const theme = document.body.dataset.theme;
  updateDarkModeIcon(theme);
}

function updateDarkModeIcon(theme) {
  if (!theme) theme = document.body.dataset.theme;
  darkModeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Load bookmarks from database
async function loadBookmarks() {
  try {
    console.log('Loading bookmarks with filters:', currentFilters);
    filteredBookmarks = await db.getBookmarks(currentFilters);
    console.log('Loaded bookmarks:', filteredBookmarks.length, 'items');
    updateUI();
  } catch (error) {
    console.error('Error loading bookmarks:', error);
  }
}

// Load folders for filter dropdown
async function loadFolders() {
  // Get both custom folders and folders from bookmarks
  const customFolders = await db.getSetting('customFolders', []);
  const bookmarkFolders = await db.getAllFolders();
  
  // Merge and deduplicate, then sort
  const folders = [...new Set([...customFolders, ...bookmarkFolders])].sort();
  
  folderFilter.innerHTML = '<option value="">All Folders</option>';
  folders.forEach(folder => {
    const option = document.createElement('option');
    option.value = folder;
    option.textContent = folder;
    folderFilter.appendChild(option);
  });
  
  // Update folder sidebar
  updateFolderSidebar(folders);
}

// Update folder sidebar with clickable folder list
function updateFolderSidebar(folders) {
  const container = document.getElementById('folderItemsContainer');
  container.innerHTML = '';
  
  folders.forEach(folder => {
    const btn = document.createElement('button');
    btn.className = 'folder-item';
    btn.dataset.folder = folder;
    btn.textContent = `📁 ${folder}`;
    
    btn.addEventListener('click', () => {
      // Remove active class from all folder items
      document.querySelectorAll('.folder-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Add active class to clicked item
      btn.classList.add('active');
      
      // Filter by this folder
      folderFilter.value = folder;
      applyFilters();
    });
    
    container.appendChild(btn);
  });
  
  // Add event listener for "All Bookmarks"
  const allBtn = document.querySelector('.folder-item[data-folder=""]');
  if (allBtn) {
    allBtn.addEventListener('click', () => {
      document.querySelectorAll('.folder-item').forEach(item => {
        item.classList.remove('active');
      });
      allBtn.classList.add('active');
      folderFilter.value = '';
      applyFilters();
    });
  }
}

// Apply filters and reload
async function applyFilters() {
  currentFilters.search = searchInput.value.trim();
  currentFilters.fileType = fileTypeFilter.value || undefined;
  currentFilters.folder = folderFilter.value || undefined;
  currentFilters.sort = sortBy.value;
  currentFilters.useRegex = useRegex.checked;
  currentFilters.favoritesOnly = favoritesOnly.checked;
  
  // Date filters
  currentFilters.dateFrom = dateFrom.value ? new Date(dateFrom.value).getTime() : null;
  currentFilters.dateTo = dateTo.value ? new Date(dateTo.value).getTime() + 86400000 : null; // End of day
  
  // Usage filters
  currentFilters.usageMin = usageMin.value ? parseInt(usageMin.value) : undefined;
  currentFilters.usageMax = usageMax.value ? parseInt(usageMax.value) : undefined;
  
  filteredBookmarks = await db.getBookmarks(currentFilters);
  updateUI();
}

// Update the UI
function updateUI() {
  // Update counts
  const count = filteredBookmarks.length;
  bookmarkCount.textContent = `${count} bookmark${count !== 1 ? 's' : ''}`;
  
  if (bulkModeActive && selectedBookmarks.size > 0) {
    selectedCount.classList.remove('hidden');
    selectedCount.innerHTML = ` • <strong>${selectedBookmarks.size} selected</strong>`;
  } else {
    selectedCount.classList.add('hidden');
  }
  
  // Show/hide empty state
  if (count === 0) {
    bookmarksList.innerHTML = '';
    emptyState.classList.add('visible');
    bookmarksContainer.style.display = 'none';
  } else {
    emptyState.classList.remove('visible');
    bookmarksContainer.style.display = 'block';
    renderBookmarks();
  }
}

// Render bookmarks
function renderBookmarks() {
  const fragment = document.createDocumentFragment();
  
  filteredBookmarks.forEach(bookmark => {
    const item = createBookmarkElement(bookmark);
    fragment.appendChild(item);
  });
  
  bookmarksList.innerHTML = '';
  bookmarksList.appendChild(fragment);
}

// Create bookmark element
function createBookmarkElement(bookmark) {
  const div = document.createElement('div');
  div.className = 'bookmark-item';
  div.dataset.id = bookmark.id;
  
  if (bulkModeActive) {
    div.classList.add('bulk-mode');
  }
  
  if (selectedBookmarks.has(bookmark.id)) {
    div.classList.add('selected');
  }
  
  const icon = getFileIcon(bookmark.fileType);
  const date = new Date(bookmark.dateAdded).toLocaleDateString();
  
  div.innerHTML = `
    ${bulkModeActive ? `<input type="checkbox" class="bookmark-checkbox" ${selectedBookmarks.has(bookmark.id) ? 'checked' : ''}>` : ''}
    <span class="bookmark-favorite ${bookmark.favorite ? 'is-favorite' : ''}" title="${bookmark.favorite ? 'Remove from favorites' : 'Add to favorites'}">⭐</span>
    <div class="bookmark-icon">${icon}</div>
    <div class="bookmark-info">
      <div class="bookmark-title" title="${escapeHtml(bookmark.filename)}">${escapeHtml(bookmark.filename)}</div>
      <div class="bookmark-meta">
        <span title="${escapeHtml(bookmark.domain)}">🌐 ${escapeHtml(bookmark.domain)}</span>
        <span>📅 ${date}</span>
        <span>👁️ ${bookmark.usageCount}</span>
        <span class="file-type-badge">${bookmark.fileType}</span>
      </div>
      ${bookmark.folder ? `<div class="bookmark-folder">📁 ${escapeHtml(bookmark.folder)}</div>` : ''}
      ${bookmark.tags && bookmark.tags.length > 0 ? `
        <div class="bookmark-tags">
          ${bookmark.tags.map(tag => `<span class="tag" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</span>`).join('')}
        </div>
      ` : ''}
      ${bookmark.notes ? `<div class="bookmark-notes">${escapeHtml(bookmark.notes)}</div>` : ''}
    </div>
  `;
  
  // Add event listeners
  if (bulkModeActive) {
    const checkbox = div.querySelector('.bookmark-checkbox');
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBookmarkSelection(bookmark.id, checkbox.checked);
    });
  }
  
  const favoriteBtn = div.querySelector('.bookmark-favorite');
  favoriteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(bookmark);
  });
  
  // Tag click to filter
  div.querySelectorAll('.tag').forEach(tagEl => {
    tagEl.addEventListener('click', (e) => {
      e.stopPropagation();
      filterByTag(tagEl.dataset.tag);
    });
  });
  
  // Click on the item to open (if not in bulk mode)
  if (!bulkModeActive) {
    div.addEventListener('click', () => {
      openBookmark(bookmark);
    });
  }
  
  // Right-click context menu
  div.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showBookmarkContextMenu(e, bookmark);
  });
  
  return div;
}

// Show context menu for bookmark
function showBookmarkContextMenu(e, bookmark) {
  // Remove any existing context menu
  const existingMenu = document.querySelector('.bookmark-context-menu');
  if (existingMenu) existingMenu.remove();
  
  const menu = document.createElement('div');
  menu.className = 'bookmark-context-menu';
  menu.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    min-width: 180px;
    padding: 4px;
  `;
  
  menu.innerHTML = `
    <div class="context-menu-item" data-action="open" style="padding: 8px 12px; cursor: pointer; border-radius: 4px; font-size: 14px;">
      🔗 Open
    </div>
    <div class="context-menu-item" data-action="edit" style="padding: 8px 12px; cursor: pointer; border-radius: 4px; font-size: 14px;">
      ✏️ Edit
    </div>
    <div class="context-menu-item" data-action="copy" style="padding: 8px 12px; cursor: pointer; border-radius: 4px; font-size: 14px;">
      📋 Copy URL
    </div>
    <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
    <div class="context-menu-item" data-action="delete" style="padding: 8px 12px; cursor: pointer; border-radius: 4px; font-size: 14px; color: #d32f2f;">
      🗑️ Delete
    </div>
  `;
  
  document.body.appendChild(menu);
  
  // Add hover effects
  menu.querySelectorAll('.context-menu-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.background = '#f5f5f5';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = 'transparent';
    });
    
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      menu.remove();
      
      switch(action) {
        case 'open':
          openBookmark(bookmark);
          break;
        case 'edit':
          openEditModal(bookmark);
          break;
        case 'copy':
          copyToClipboard(bookmark.url);
          break;
        case 'delete':
          deleteBookmark(bookmark.id);
          break;
      }
    });
  });
  
  // Close menu on click outside
  setTimeout(() => {
    document.addEventListener('click', function closeMenu() {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    });
  }, 0);
  
  // Adjust position if menu goes off screen
  const rect = menu.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    menu.style.left = (e.clientX - rect.width) + 'px';
  }
  if (rect.bottom > window.innerHeight) {
    menu.style.top = (e.clientY - rect.height) + 'px';
  }
}

// Toggle favorite
async function toggleFavorite(bookmark) {
  try {
    await db.updateBookmark(bookmark.id, {
      favorite: !bookmark.favorite
    });
    await loadBookmarks();
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
}

// Open bookmark in new tab
async function openBookmark(bookmark) {
  try {
    await db.updateBookmark(bookmark.id, {
      usageCount: bookmark.usageCount + 1
    });
    
    chrome.tabs.create({ url: bookmark.url });
  } catch (error) {
    console.error('Error opening bookmark:', error);
  }
}

// Copy URL to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification('URL copied to clipboard!');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
  }
}

// Delete bookmark
async function deleteBookmark(id) {
  if (confirm('Are you sure you want to delete this bookmark?')) {
    try {
      await db.deleteBookmark(id);
      await loadBookmarks();
      showNotification('Bookmark deleted');
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  }
}

// Filter by tag
function filterByTag(tag) {
  if (!currentFilters.tags.includes(tag)) {
    currentFilters.tags.push(tag);
    updateTagFilters();
    applyFilters();
  }
}

// Update tag filter display
function updateTagFilters() {
  const container = document.getElementById('tagFilterContainer');
  const activeFilters = document.getElementById('activeTagFilters');
  
  if (currentFilters.tags.length > 0) {
    container.classList.remove('hidden');
    activeFilters.innerHTML = currentFilters.tags.map(tag => 
      `<span class="tag-filter-item">${escapeHtml(tag)} <span class="tag-remove" data-tag="${escapeHtml(tag)}">×</span></span>`
    ).join('');
    
    // Add remove listeners
    activeFilters.querySelectorAll('.tag-remove').forEach(el => {
      el.addEventListener('click', () => {
        const tag = el.dataset.tag;
        currentFilters.tags = currentFilters.tags.filter(t => t !== tag);
        updateTagFilters();
        applyFilters();
      });
    });
  } else {
    container.classList.add('hidden');
  }
}

// Export bookmarks
async function exportBookmarks(format = 'json') {
  try {
    let content, filename, mimeType;
    
    switch (format) {
      case 'json':
        content = await db.exportToJSON();
        filename = `bookmarks-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      case 'csv':
        content = await db.exportToCSV();
        filename = `bookmarks-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;
      case 'html':
        content = await db.exportToHTML();
        filename = `bookmarks-${Date.now()}.html`;
        mimeType = 'text/html';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`Bookmarks exported as ${format.toUpperCase()}!`);
  } catch (error) {
    console.error('Error exporting bookmarks:', error);
    alert('Failed to export bookmarks');
  }
}

// Import bookmarks
async function importBookmarks(file) {
  try {
    const text = await file.text();
    const result = await db.importFromJSON(text);
    await loadBookmarks();
    showNotification(`Imported ${result.imported} bookmarks (${result.skipped} duplicates skipped)`);
  } catch (error) {
    console.error('Error importing bookmarks:', error);
    alert('Failed to import bookmarks: ' + error.message);
  }
}

// Clear all bookmarks
async function clearAllBookmarks() {
  if (confirm('Are you sure you want to delete ALL bookmarks? This cannot be undone.')) {
    try {
      await db.clearAll();
      await loadBookmarks();
      showNotification('All bookmarks cleared');
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
    }
  }
}

// Save current page as bookmark
async function saveCurrentPage() {
  try {
    // Get current tab info
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Store pending save info
    pendingBookmarkSave = {
      url: tab.url,
      title: tab.title
    };
    
    // Populate modal
    saveTitle.value = tab.title;
    saveTags.value = '';
    
    // Load folders into dropdown
    await loadFoldersToSaveModal();
    
    // Show modal
    saveBookmarkModal.classList.remove('hidden');
  } catch (error) {
    console.error('Error preparing to save page:', error);
    showNotification('Failed to prepare bookmark');
  }
}

// Load folders into save modal dropdown
async function loadFoldersToSaveModal() {
  const customFolders = await db.getSetting('customFolders', []);
  const bookmarkFolders = await db.getAllFolders();
  const folders = [...new Set([...customFolders, ...bookmarkFolders])].sort();
  
  saveFolderSelect.innerHTML = '<option value="">No Folder</option>';
  folders.forEach(folder => {
    const option = document.createElement('option');
    option.value = folder;
    option.textContent = folder;
    saveFolderSelect.appendChild(option);
  });
}

// Confirm and save the bookmark
async function confirmBookmarkSave() {
  if (!pendingBookmarkSave) return;
  
  const title = saveTitle.value.trim() || pendingBookmarkSave.title;
  const folder = saveFolderSelect.value || null;
  const tagsInput = saveTags.value.trim();
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
  
  try {
    // Send to background script with additional metadata
    const response = await chrome.runtime.sendMessage({ 
      action: 'saveCurrentPage',
      metadata: { title, folder, tags }
    });
    
    if (response && response.success) {
      saveBookmarkModal.classList.add('hidden');
      pendingBookmarkSave = null;
      await loadBookmarks();
      showNotification('Bookmark saved successfully!');
    }
  } catch (error) {
    console.error('Error saving bookmark:', error);
    showNotification('Failed to save bookmark');
  }
}

// Show export menu
function showExportMenu() {
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.cssText = `
    position: absolute;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 1000;
  `;
  
  menu.innerHTML = `
    <button class="export-option" data-format="json" style="display: block; width: 100%; text-align: left; padding: 8px 12px; border: none; background: none; cursor: pointer; border-radius: 4px;">JSON</button>
    <button class="export-option" data-format="csv" style="display: block; width: 100%; text-align: left; padding: 8px 12px; border: none; background: none; cursor: pointer; border-radius: 4px;">CSV</button>
    <button class="export-option" data-format="html" style="display: block; width: 100%; text-align: left; padding: 8px 12px; border: none; background: none; cursor: pointer; border-radius: 4px;">HTML</button>
  `;
  
  const rect = exportBtn.getBoundingClientRect();
  menu.style.top = rect.bottom + 'px';
  menu.style.left = rect.left + 'px';
  
  document.body.appendChild(menu);
  
  menu.querySelectorAll('.export-option').forEach(btn => {
    btn.addEventListener('mouseover', () => btn.style.background = '#f0f0f0');
    btn.addEventListener('mouseout', () => btn.style.background = 'none');
    btn.addEventListener('click', () => {
      exportBookmarks(btn.dataset.format);
      document.body.removeChild(menu);
    });
  });
  
  // Close menu when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closeMenu() {
      if (document.body.contains(menu)) {
        document.body.removeChild(menu);
      }
      document.removeEventListener('click', closeMenu);
    });
  }, 100);
}

// Bulk operations
function toggleBulkModeUI() {
  bulkModeActive = !bulkModeActive;
  
  if (bulkModeActive) {
    bulkActions.classList.remove('hidden');
    toggleBulkMode.style.background = '#fff3cd';
  } else {
    bulkActions.classList.add('hidden');
    toggleBulkMode.style.background = '';
    selectedBookmarks.clear();
  }
  
  renderBookmarks();
  updateUI();
}

function toggleBookmarkSelection(id, selected) {
  if (selected) {
    selectedBookmarks.add(id);
  } else {
    selectedBookmarks.delete(id);
  }
  updateUI();
}

async function bulkSelectAllBookmarks() {
  filteredBookmarks.forEach(b => selectedBookmarks.add(b.id));
  renderBookmarks();
  updateUI();
}

async function bulkDeselectAllBookmarks() {
  selectedBookmarks.clear();
  renderBookmarks();
  updateUI();
}

async function bulkDeleteBookmarks() {
  if (selectedBookmarks.size === 0) return;
  
  if (confirm(`Delete ${selectedBookmarks.size} bookmarks? This cannot be undone.`)) {
    try {
      await db.deleteMultiple(Array.from(selectedBookmarks));
      selectedBookmarks.clear();
      await loadBookmarks();
      showNotification('Bookmarks deleted');
    } catch (error) {
      console.error('Error deleting bookmarks:', error);
    }
  }
}

async function bulkAddTags() {
  if (selectedBookmarks.size === 0) return;
  
  const tag = prompt('Enter tag to add:');
  if (!tag) return;
  
  try {
    const promises = Array.from(selectedBookmarks).map(async id => {
      const bookmark = filteredBookmarks.find(b => b.id === id);
      if (bookmark) {
        const tags = bookmark.tags || [];
        if (!tags.includes(tag)) {
          tags.push(tag);
          await db.updateBookmark(id, { tags });
        }
      }
    });
    
    await Promise.all(promises);
    await loadBookmarks();
    showNotification('Tags added');
  } catch (error) {
    console.error('Error adding tags:', error);
  }
}

async function bulkSetFolders() {
  if (selectedBookmarks.size === 0) return;
  
  const folder = prompt('Enter folder name:');
  if (folder === null) return;
  
  try {
    await db.updateMultiple(Array.from(selectedBookmarks), { folder: folder || null });
    await loadBookmarks();
    await loadFolders();
    showNotification('Folder set');
  } catch (error) {
    console.error('Error setting folder:', error);
  }
}

async function bulkExportBookmarks() {
  if (selectedBookmarks.size === 0) return;
  
  const selected = filteredBookmarks.filter(b => selectedBookmarks.has(b.id));
  const json = JSON.stringify(selected, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `selected-bookmarks-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotification(`Exported ${selected.length} bookmarks`);
}

// Edit modal functions
async function openEditModal(bookmark) {
  currentEditingBookmark = bookmark;
  
  document.getElementById('editTitle').value = bookmark.filename;
  document.getElementById('editNotes').value = bookmark.notes || '';
  document.getElementById('editFavorite').checked = bookmark.favorite || false;
  
  // Load folders into dropdown
  const customFolders = await db.getSetting('customFolders', []);
  const bookmarkFolders = await db.getAllFolders();
  const folders = [...new Set([...customFolders, ...bookmarkFolders])].sort();
  
  const editFolder = document.getElementById('editFolder');
  editFolder.innerHTML = '<option value="">No Folder</option>';
  folders.forEach(folder => {
    const option = document.createElement('option');
    option.value = folder;
    option.textContent = folder;
    editFolder.appendChild(option);
  });
  
  // Set current folder
  editFolder.value = bookmark.folder || '';
  
  // Load tags
  displayTags(bookmark.tags || []);
  
  // Load tag suggestions
  await loadTagSuggestions();
  
  editModal.classList.remove('hidden');
}

function displayTags(tags) {
  const display = document.getElementById('editTagsDisplay');
  display.innerHTML = tags.map(tag => 
    `<span class="tag">${escapeHtml(tag)} <span class="tag-remove" data-tag="${escapeHtml(tag)}">×</span></span>`
  ).join('');
  
  display.querySelectorAll('.tag-remove').forEach(el => {
    el.addEventListener('click', () => {
      const tag = el.dataset.tag;
      const tags = Array.from(display.querySelectorAll('.tag')).map(t => t.textContent.replace('×', '').trim()).filter(t => t !== tag);
      displayTags(tags);
    });
  });
}

async function loadTagSuggestions() {
  const allTags = await db.getAllTags();
  const tagSuggestions = document.getElementById('tagSuggestions');
  const tagInput = document.getElementById('editTagInput');
  
  tagInput.addEventListener('input', () => {
    const value = tagInput.value.toLowerCase();
    if (value.length === 0) {
      tagSuggestions.innerHTML = '';
      return;
    }
    
    const currentTags = Array.from(document.getElementById('editTagsDisplay').querySelectorAll('.tag')).map(t => t.textContent.replace('×', '').trim());
    const suggestions = allTags.filter(tag => 
      tag.toLowerCase().includes(value) && !currentTags.includes(tag)
    );
    
    tagSuggestions.innerHTML = suggestions.slice(0, 5).map(tag => 
      `<div class="tag-suggestion" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</div>`
    ).join('');
    
    tagSuggestions.querySelectorAll('.tag-suggestion').forEach(el => {
      el.addEventListener('click', () => {
        addTag(el.dataset.tag);
        tagInput.value = '';
        tagSuggestions.innerHTML = '';
      });
    });
  });
  
  tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && tagInput.value.trim()) {
      e.preventDefault();
      addTag(tagInput.value.trim());
      tagInput.value = '';
      tagSuggestions.innerHTML = '';
    }
  });
}

function addTag(tag) {
  const display = document.getElementById('editTagsDisplay');
  const currentTags = Array.from(display.querySelectorAll('.tag')).map(t => t.textContent.replace('×', '').trim());
  if (!currentTags.includes(tag)) {
    currentTags.push(tag);
    displayTags(currentTags);
  }
}

async function saveEdit() {
  if (!currentEditingBookmark) return;
  
  const title = document.getElementById('editTitle').value.trim();
  const folder = document.getElementById('editFolder').value.trim() || null;
  const notes = document.getElementById('editNotes').value.trim();
  const favorite = document.getElementById('editFavorite').checked;
  const tags = Array.from(document.getElementById('editTagsDisplay').querySelectorAll('.tag')).map(t => t.textContent.replace('×', '').trim());
  
  try {
    await db.updateBookmark(currentEditingBookmark.id, {
      filename: title,
      title: title,
      folder,
      notes,
      favorite,
      tags
    });
    
    editModal.classList.add('hidden');
    await loadBookmarks();
    await loadFolders();
    showNotification('Bookmark updated');
  } catch (error) {
    console.error('Error updating bookmark:', error);
    alert('Failed to update bookmark');
  }
}

// Statistics modal
async function showStatistics() {
  const stats = await db.getStatistics();
  const tagStats = await db.getTagStats();
  
  const content = document.getElementById('statsContent');
  content.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.total}</div>
        <div class="stat-label">Total Bookmarks</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.favorites}</div>
        <div class="stat-label">Favorites</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.recentlyAdded}</div>
        <div class="stat-label">Added This Week</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.totalUsage}</div>
        <div class="stat-label">Total Opens</div>
      </div>
    </div>
    
    <div class="chart-container">
      <div class="chart-title">Top File Types</div>
      ${Object.entries(stats.byFileType).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([type, count]) => {
        const percentage = (count / stats.total * 100).toFixed(1);
        return `
          <div class="chart-bar">
            <div class="chart-label">${type.toUpperCase()}</div>
            <div class="chart-bar-fill" style="width: ${percentage}%">
              <span class="chart-value">${count}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    
    <div class="chart-container">
      <div class="chart-title">Top Domains</div>
      ${Object.entries(stats.byDomain).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([domain, count]) => {
        const percentage = (count / stats.total * 100).toFixed(1);
        return `
          <div class="chart-bar">
            <div class="chart-label" title="${escapeHtml(domain)}">${escapeHtml(domain.substring(0, 20))}</div>
            <div class="chart-bar-fill" style="width: ${percentage}%">
              <span class="chart-value">${count}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    
    ${tagStats.length > 0 ? `
      <div class="chart-container">
        <div class="chart-title">Popular Tags</div>
        ${tagStats.slice(0, 5).map(({ tag, count }) => {
          const percentage = (count / stats.total * 100).toFixed(1);
          return `
            <div class="chart-bar">
              <div class="chart-label">${escapeHtml(tag)}</div>
              <div class="chart-bar-fill" style="width: ${percentage}%">
                <span class="chart-value">${count}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : ''}
    
    <div class="chart-container">
      <div class="chart-title">Most Used Bookmarks</div>
      ${stats.mostUsed.slice(0, 5).map(b => `
        <div style="padding: 8px; background: #f8f9fa; border-radius: 4px; margin-bottom: 6px;">
          <div style="font-weight: 600; font-size: 13px;">${escapeHtml(b.filename)}</div>
          <div style="font-size: 12px; color: #666;">Opens: ${b.usageCount}</div>
        </div>
      `).join('')}
    </div>
  `;
  
  statsModal.classList.remove('hidden');
}

// Settings modal
async function showSettings() {
  const theme = await db.getSetting('theme', 'light');
  const defaultSort = await db.getSetting('defaultSort', 'dateAdded');
  const autoBackup = await db.getSetting('autoBackup', false);
  
  document.getElementById('themeSelect').value = theme;
  document.getElementById('defaultSort').value = defaultSort;
  document.getElementById('autoBackup').checked = autoBackup;
  
  settingsModal.classList.remove('hidden');
}

async function saveSettings() {
  const theme = document.getElementById('themeSelect').value;
  const defaultSort = document.getElementById('defaultSort').value;
  const autoBackup = document.getElementById('autoBackup').checked;
  
  await db.saveSetting('theme', theme);
  await db.saveSetting('defaultSort', defaultSort);
  await db.saveSetting('autoBackup', autoBackup);
  
  document.body.dataset.theme = theme;
  updateDarkModeIcon(theme);
  currentFilters.sort = defaultSort;
  sortBy.value = defaultSort;
  
  settingsModal.classList.add('hidden');
  await applyFilters();
  showNotification('Settings saved');
}

// Toggle dark mode
async function toggleDarkMode() {
  const currentTheme = document.body.dataset.theme;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.body.dataset.theme = newTheme;
  await db.saveSetting('theme', newTheme);
  updateDarkModeIcon(newTheme);
}

// Show temporary notification
function showNotification(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 10000;
    animation: slideUp 0.3s ease;
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Get file icon based on type
function getFileIcon(fileType) {
  const icons = {
    pdf: '📄', zip: '🗜️', rar: '🗜️', '7z': '🗜️',
    exe: '⚙️', dmg: '💿', iso: '💿',
    doc: '📝', docx: '📝', xls: '📊', xlsx: '📊', ppt: '📽️', pptx: '📽️',
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', svg: '🖼️',
    mp4: '🎬', avi: '🎬', mkv: '🎬',
    mp3: '🎵', wav: '🎵', flac: '🎵',
    html: '🌐', css: '🎨', js: '📜', json: '📋', xml: '📋', txt: '📃',
    unknown: '📎'
  };
  return icons[fileType] || icons.unknown;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Folder Management Functions
async function showFoldersModal() {
  foldersModal.classList.remove('hidden');
  await loadFoldersToModal();
}

async function loadFoldersToModal() {
  // Get both custom folders and folders from bookmarks
  const customFolders = await db.getSetting('customFolders', []);
  const bookmarkFolders = await db.getAllFolders();
  
  // Merge and deduplicate
  const allFolders = [...new Set([...customFolders, ...bookmarkFolders])];
  
  foldersListContainer.innerHTML = '';
  
  if (allFolders.length === 0) {
    foldersListContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No folders yet. Create one above!</p>';
    return;
  }
  
  const folders = allFolders;
  
  folders.forEach(folder => {
    const folderItem = document.createElement('div');
    folderItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #e0e0e0;';
    
    const folderName = document.createElement('span');
    folderName.textContent = folder;
    folderName.style.cssText = 'flex: 1;';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ Delete';
    deleteBtn.className = 'btn-small';
    deleteBtn.style.cssText = 'padding: 4px 8px; font-size: 12px;';
    deleteBtn.onclick = async () => {
      if (confirm(`Delete folder "${folder}"? Bookmarks in this folder will not be deleted, just unfiled.`)) {
        await deleteFolder(folder);
        await loadFoldersToModal();
        await loadFolders(); // Refresh filter dropdown
      }
    };
    
    folderItem.appendChild(folderName);
    folderItem.appendChild(deleteBtn);
    foldersListContainer.appendChild(folderItem);
  });
}

async function createFolder() {
  const folderName = newFolderInput.value.trim();
  
  if (!folderName) {
    alert('Please enter a folder name');
    return;
  }
  
  // Get existing stored folders
  let folders = await db.getSetting('customFolders', []);
  
  if (folders.includes(folderName)) {
    alert('This folder already exists');
    return;
  }
  
  // Add new folder to storage
  folders.push(folderName);
  await db.saveSetting('customFolders', folders);
  
  newFolderInput.value = '';
  await loadFoldersToModal();
  await loadFolders(); // Refresh filter dropdown
  
  showNotification(`Folder "${folderName}" created!`);
}

async function deleteFolder(folderName) {
  // Remove folder from all bookmarks that have it
  const bookmarks = await db.getAllBookmarks();
  for (const bookmark of bookmarks) {
    if (bookmark.folder === folderName) {
      bookmark.folder = null;
      await db.updateBookmark(bookmark.id, bookmark);
    }
  }
  
  // Remove from custom folders storage
  let folders = await db.getSetting('customFolders', []);
  folders = folders.filter(f => f !== folderName);
  await db.saveSetting('customFolders', folders);
}

// Setup event listeners
function setupEventListeners() {
  // Search input with debounce
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      applyFilters();
    }, 300);
  });
  
  // Filters
  fileTypeFilter.addEventListener('change', applyFilters);
  folderFilter.addEventListener('change', applyFilters);
  sortBy.addEventListener('change', applyFilters);
  useRegex.addEventListener('change', applyFilters);
  favoritesOnly.addEventListener('change', applyFilters);
  dateFrom.addEventListener('change', applyFilters);
  dateTo.addEventListener('change', applyFilters);
  usageMin.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 500);
  });
  usageMax.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 500);
  });
  
  // Advanced search toggle
  advancedSearchBtn.addEventListener('click', () => {
    advancedSearchPanel.classList.toggle('hidden');
  });
  
  // Clear tag filters
  document.getElementById('clearTagFilters').addEventListener('click', () => {
    currentFilters.tags = [];
    updateTagFilters();
    applyFilters();
  });
  
  // Action buttons
  saveCurrentPageBtn.addEventListener('click', saveCurrentPage);
  manageFoldersBtn.addEventListener('click', showFoldersModal);
  exportBtn.addEventListener('click', showExportMenu);
  importBtn.addEventListener('click', () => fileInput.click());
//   clearBtn.addEventListener('click', clearAllBookmarks);
  statsBtn.addEventListener('click', showStatistics);
  settingsBtn.addEventListener('click', showSettings);
  darkModeToggle.addEventListener('click', toggleDarkMode);
  
  // Bulk mode
  toggleBulkMode.addEventListener('click', toggleBulkModeUI);
  bulkSelectAll.addEventListener('click', bulkSelectAllBookmarks);
  bulkDeselectAll.addEventListener('click', bulkDeselectAllBookmarks);
  bulkDelete.addEventListener('click', bulkDeleteBookmarks);
  bulkAddTag.addEventListener('click', bulkAddTags);
  bulkSetFolder.addEventListener('click', bulkSetFolders);
  bulkExport.addEventListener('click', bulkExportBookmarks);
  
  // File input
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      importBookmarks(file);
    }
    fileInput.value = '';
  });
  
  // Modal close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      editModal.classList.add('hidden');
      statsModal.classList.add('hidden');
      settingsModal.classList.add('hidden');
      foldersModal.classList.add('hidden');
      saveBookmarkModal.classList.add('hidden');
    });
  });
  
  // Save edit
  document.getElementById('saveEdit').addEventListener('click', saveEdit);
  
  // Save settings
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  
  // Folder management
  createFolderBtn.addEventListener('click', createFolder);
  
  // Save bookmark confirmation
  confirmSave.addEventListener('click', confirmBookmarkSave);
  
  // Close modals on background click
  [editModal, statsModal, settingsModal, foldersModal, saveBookmarkModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
}

// Initialize when DOM is ready
init();
