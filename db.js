// IndexedDB wrapper for bookmark storage
export class BookmarkDB {
  constructor() {
    this.dbName = 'BookmarkOrganizerDB';
    this.version = 2; // Upgraded for new features
    this.storeName = 'bookmarks';
    this.settingsStore = 'settings';
    this.db = null;
  }

  // Initialize database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const oldVersion = event.oldVersion;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Create indexes for efficient searching
          objectStore.createIndex('url', 'url', { unique: true });
          objectStore.createIndex('domain', 'domain', { unique: false });
          objectStore.createIndex('fileType', 'fileType', { unique: false });
          objectStore.createIndex('dateAdded', 'dateAdded', { unique: false });
          objectStore.createIndex('filename', 'filename', { unique: false });
          objectStore.createIndex('favorite', 'favorite', { unique: false });
          objectStore.createIndex('folder', 'folder', { unique: false });
        }
        
        // Create settings store for v2+
        if (!db.objectStoreNames.contains(this.settingsStore)) {
          db.createObjectStore(this.settingsStore, { keyPath: 'key' });
        }
        
        // Migration for existing data (v1 to v2)
        if (oldVersion < 2) {
          const transaction = event.target.transaction;
          const objectStore = transaction.objectStore(this.storeName);
          
          // Add new fields to existing bookmarks
          objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              const bookmark = cursor.value;
              if (!bookmark.hasOwnProperty('favorite')) bookmark.favorite = false;
              if (!bookmark.hasOwnProperty('notes')) bookmark.notes = '';
              if (!bookmark.hasOwnProperty('folder')) bookmark.folder = null;
              cursor.update(bookmark);
              cursor.continue();
            }
          };
        }
      };
    });
  }

  // Ensure DB is initialized
  async ensureDB() {
    if (!this.db) {
      await this.init();
    }
  }

  // Add a bookmark
  async addBookmark(bookmark) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.add(bookmark);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Check for duplicate URL
  async checkDuplicate(url) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const index = objectStore.index('url');
      const request = index.get(url);

      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all bookmarks
  async getAllBookmarks() {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get bookmarks with filtering and sorting
  async getBookmarks(filters = {}) {
    let bookmarks = await this.getAllBookmarks();

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      
      // Check if using regex
      if (filters.useRegex) {
        try {
          const regex = new RegExp(search, 'i');
          bookmarks = bookmarks.filter(b => 
            regex.test(b.filename) ||
            regex.test(b.domain) ||
            (b.tags && b.tags.some(tag => regex.test(tag))) ||
            (b.notes && regex.test(b.notes))
          );
        } catch (e) {
          // Invalid regex, fall back to normal search
          bookmarks = bookmarks.filter(b => 
            b.filename.toLowerCase().includes(search) ||
            b.domain.toLowerCase().includes(search) ||
            (b.tags && b.tags.some(tag => tag.toLowerCase().includes(search))) ||
            (b.notes && b.notes.toLowerCase().includes(search))
          );
        }
      } else {
        // Normal search
        bookmarks = bookmarks.filter(b => 
          b.filename.toLowerCase().includes(search) ||
          b.domain.toLowerCase().includes(search) ||
          (b.tags && b.tags.some(tag => tag.toLowerCase().includes(search))) ||
          (b.notes && b.notes.toLowerCase().includes(search))
        );
      }
    }

    // Apply file type filter
    if (filters.fileType) {
      bookmarks = bookmarks.filter(b => b.fileType === filters.fileType);
    }
    
    // Apply tags filter (multiple tags with AND logic)
    if (filters.tags && filters.tags.length > 0) {
      bookmarks = bookmarks.filter(b => 
        b.tags && filters.tags.every(tag => 
          b.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        )
      );
    }
    
    // Apply favorite filter
    if (filters.favoritesOnly) {
      bookmarks = bookmarks.filter(b => b.favorite);
    }
    
    // Apply folder filter
    if (filters.folder !== undefined) {
      bookmarks = bookmarks.filter(b => b.folder === filters.folder);
    }
    
    // Apply date range filter
    if (filters.dateFrom) {
      bookmarks = bookmarks.filter(b => b.dateAdded >= filters.dateFrom);
    }
    if (filters.dateTo) {
      bookmarks = bookmarks.filter(b => b.dateAdded <= filters.dateTo);
    }
    
    // Apply usage range filter
    if (filters.usageMin !== undefined) {
      bookmarks = bookmarks.filter(b => b.usageCount >= filters.usageMin);
    }
    if (filters.usageMax !== undefined) {
      bookmarks = bookmarks.filter(b => b.usageCount <= filters.usageMax);
    }

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'dateAdded':
          bookmarks.sort((a, b) => b.dateAdded - a.dateAdded);
          break;
        case 'dateAddedOld':
          bookmarks.sort((a, b) => a.dateAdded - b.dateAdded);
          break;
        case 'name':
          bookmarks.sort((a, b) => a.filename.localeCompare(b.filename));
          break;
        case 'nameDesc':
          bookmarks.sort((a, b) => b.filename.localeCompare(a.filename));
          break;
        case 'usage':
          bookmarks.sort((a, b) => b.usageCount - a.usageCount);
          break;
        case 'domain':
          bookmarks.sort((a, b) => a.domain.localeCompare(b.domain));
          break;
      }
    }

    return bookmarks;
  }

  // Update bookmark (increment usage count)
  async updateBookmark(id, updates) {
    await this.ensureDB();
    
    return new Promise(async (resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      
      // Get existing bookmark
      const getRequest = objectStore.get(id);
      
      getRequest.onsuccess = () => {
        const bookmark = getRequest.result;
        if (bookmark) {
          // Apply updates
          Object.assign(bookmark, updates);
          const putRequest = objectStore.put(bookmark);
          
          putRequest.onsuccess = () => resolve(putRequest.result);
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Bookmark not found'));
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Delete a bookmark
  async deleteBookmark(id) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all bookmarks
  async clearAll() {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get count of bookmarks
  async getCount() {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Export all bookmarks as JSON
  async exportToJSON() {
    const bookmarks = await this.getAllBookmarks();
    return JSON.stringify(bookmarks, null, 2);
  }

  // Import bookmarks from JSON
  async importFromJSON(jsonString) {
    try {
      const bookmarks = JSON.parse(jsonString);
      
      if (!Array.isArray(bookmarks)) {
        throw new Error('Invalid JSON format: expected array');
      }

      let imported = 0;
      let skipped = 0;

      for (const bookmark of bookmarks) {
        // Check for duplicate
        const isDuplicate = await this.checkDuplicate(bookmark.url);
        
        if (!isDuplicate) {
          // Remove the id if it exists (will be auto-generated)
          delete bookmark.id;
          await this.addBookmark(bookmark);
          imported++;
        } else {
          skipped++;
        }
      }

      return { imported, skipped, total: bookmarks.length };
    } catch (error) {
      throw new Error('Failed to import bookmarks: ' + error.message);
    }
  }
  
  // ===== BULK OPERATIONS =====
  
  // Delete multiple bookmarks
  async deleteMultiple(ids) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      
      let deleted = 0;
      let errors = 0;
      
      ids.forEach(id => {
        const request = objectStore.delete(id);
        request.onsuccess = () => deleted++;
        request.onerror = () => errors++;
      });
      
      transaction.oncomplete = () => resolve({ deleted, errors });
      transaction.onerror = () => reject(transaction.error);
    });
  }
  
  // Update multiple bookmarks
  async updateMultiple(ids, updates) {
    await this.ensureDB();
    const results = [];
    
    for (const id of ids) {
      try {
        await this.updateBookmark(id, updates);
        results.push({ id, success: true });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }
    
    return results;
  }
  
  // ===== TAGS OPERATIONS =====
  
  // Get all unique tags
  async getAllTags() {
    const bookmarks = await this.getAllBookmarks();
    const tagsSet = new Set();
    
    bookmarks.forEach(b => {
      if (b.tags && Array.isArray(b.tags)) {
        b.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    
    return Array.from(tagsSet).sort();
  }
  
  // Get tag usage statistics
  async getTagStats() {
    const bookmarks = await this.getAllBookmarks();
    const tagCounts = {};
    
    bookmarks.forEach(b => {
      if (b.tags && Array.isArray(b.tags)) {
        b.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  // ===== FOLDERS OPERATIONS =====
  
  // Get all unique folders
  async getAllFolders() {
    const bookmarks = await this.getAllBookmarks();
    const foldersSet = new Set();
    
    bookmarks.forEach(b => {
      if (b.folder) {
        foldersSet.add(b.folder);
      }
    });
    
    return Array.from(foldersSet).sort();
  }
  
  // ===== SETTINGS OPERATIONS =====
  
  // Save a setting
  async saveSetting(key, value) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.settingsStore], 'readwrite');
      const objectStore = transaction.objectStore(this.settingsStore);
      const request = objectStore.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  // Get a setting
  async getSetting(key, defaultValue = null) {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.settingsStore], 'readonly');
      const objectStore = transaction.objectStore(this.settingsStore);
      const request = objectStore.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : defaultValue);
      };
      request.onerror = () => reject(request.error);
    });
  }
  
  // ===== EXPORT OPERATIONS =====
  
  // Export to CSV
  async exportToCSV() {
    const bookmarks = await this.getAllBookmarks();
    
    // CSV header
    const headers = ['URL', 'Filename', 'Domain', 'File Type', 'Date Added', 'Usage Count', 'Tags', 'Favorite', 'Folder', 'Notes'];
    let csv = headers.join(',') + '\n';
    
    // CSV rows
    bookmarks.forEach(b => {
      const row = [
        `"${(b.url || '').replace(/"/g, '""')}"`,
        `"${(b.filename || '').replace(/"/g, '""')}"`,
        `"${(b.domain || '').replace(/"/g, '""')}"`,
        `"${(b.fileType || '').replace(/"/g, '""')}"`,
        new Date(b.dateAdded).toISOString(),
        b.usageCount || 0,
        `"${(b.tags || []).join('; ').replace(/"/g, '""')}"`,
        b.favorite ? 'Yes' : 'No',
        `"${(b.folder || '').replace(/"/g, '""')}"`,
        `"${(b.notes || '').replace(/"/g, '""')}"`
      ];
      csv += row.join(',') + '\n';
    });
    
    return csv;
  }
  
  // Export to HTML
  async exportToHTML() {
    const bookmarks = await this.getAllBookmarks();
    
    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;
    
    // Group by folder
    const byFolder = {};
    bookmarks.forEach(b => {
      const folder = b.folder || 'Uncategorized';
      if (!byFolder[folder]) byFolder[folder] = [];
      byFolder[folder].push(b);
    });
    
    // Generate HTML
    Object.keys(byFolder).sort().forEach(folder => {
      html += `    <DT><H3>${escapeHTML(folder)}</H3>\n    <DL><p>\n`;
      
      byFolder[folder].forEach(b => {
        const tags = b.tags && b.tags.length > 0 ? ` TAGS="${escapeHTML(b.tags.join(','))}"` : '';
        html += `        <DT><A HREF="${escapeHTML(b.url)}"${tags}>${escapeHTML(b.filename)}</A>\n`;
      });
      
      html += `    </DL><p>\n`;
    });
    
    html += `</DL><p>`;
    
    return html;
    
    function escapeHTML(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  }
  
  // ===== STATISTICS =====
  
  // Get statistics
  async getStatistics() {
    const bookmarks = await this.getAllBookmarks();
    
    const stats = {
      total: bookmarks.length,
      favorites: bookmarks.filter(b => b.favorite).length,
      byFileType: {},
      byDomain: {},
      totalUsage: 0,
      recentlyAdded: bookmarks.filter(b => b.dateAdded > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
      mostUsed: bookmarks.sort((a, b) => b.usageCount - a.usageCount).slice(0, 10)
    };
    
    bookmarks.forEach(b => {
      // File types
      stats.byFileType[b.fileType] = (stats.byFileType[b.fileType] || 0) + 1;
      
      // Domains
      stats.byDomain[b.domain] = (stats.byDomain[b.domain] || 0) + 1;
      
      // Total usage
      stats.totalUsage += b.usageCount || 0;
    });
    
    return stats;
  }
}

