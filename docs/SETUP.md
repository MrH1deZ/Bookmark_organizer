# 🚀 Setup Guide - Version 2.0

Complete installation and configuration guide for Smart Bookmark Organizer.

---

## 📋 Prerequisites

- **Browser:** Chrome, Edge, Brave, or Firefox
- **Python (Optional):** For icon generation (requires Pillow library)
- **Basic Knowledge:** Understanding of browser extensions

---

## ⚡ Quick Installation

### Chrome / Edge / Brave (5 minutes)

1. **Download the Extension**
   - Clone or download this repository
   - Extract to a permanent location (don't delete after installation)

2. **Load the Extension**
   - Open your browser
   - Navigate to:
     - Chrome: `chrome://extensions/`
     - Edge: `edge://extensions/`
     - Brave: `brave://extensions/`
   - Enable **"Developer mode"** (toggle in top-right corner)
   - Click **"Load unpacked"** button
   - Select the `Bookmark_organizer` folder
   - ✅ Extension is now installed!

3. **Verify Installation**
   - Look for the extension icon in the toolbar
   - Right-click any link - you should see "Save Link as Bookmark"
   - Click the extension icon to open the organizer

### Firefox (5 minutes)

1. **Download the Extension**
   - Clone or download this repository
   - Extract to a permanent location

2. **Load as Temporary Add-on**
   - Open Firefox
   - Navigate to: `about:debugging#/runtime/this-firefox`
   - Click **"Load Temporary Add-on..."**
   - Navigate to `Bookmark_organizer` folder
   - Select the `manifest.json` file
   - ✅ Extension is now installed!

   **Important:** Temporary add-ons are removed when Firefox restarts.

3. **For Permanent Installation**
   - Sign up at [addons.mozilla.org](https://addons.mozilla.org)
   - Submit your extension for review (requires account)
   - Follow Mozilla's submission guidelines
   - Wait for approval (typically 1-2 weeks)

---

## 🎨 Generate Icons (Optional)

The extension works with placeholder icons, but custom icons look better.

### Install Python & Pillow

```bash
# Check if Python is installed
python --version

# Install Pillow library
pip install pillow
```

### Generate Icons

```bash
# Navigate to the extension folder
cd Bookmark_organizer

# Run the icon generator
python create_icons.py
```

This creates four icon files in the `icons/` folder:
- `icon16.png` - Toolbar icon (small)
- `icon32.png` - Extension page icon
- `icon48.png` - Extension management icon
- `icon128.png` - Chrome Web Store icon

**Reload the extension** to see the new icons.

---

## ⚙️ Configuration

### Customize Keyboard Shortcuts

**Chrome / Edge / Brave:**
1. Navigate to `chrome://extensions/shortcuts` (or `edge://`, `brave://`)
2. Scroll to "Smart Bookmark Organizer"
3. Click the pencil icon ✏️ to edit
4. Set your preferred shortcuts:
   - **Save bookmark:** Default `Ctrl+Shift+S`
   - **Open organizer:** Default `Ctrl+Shift+B`
5. Click outside to save

**Firefox:**
1. Navigate to `about:addons`
2. Click the gear icon ⚙️ (top-right)
3. Select **"Manage Extension Shortcuts"**
4. Find "Smart Bookmark Organizer"
5. Click in the shortcut field and press your desired keys
6. Changes save automatically

### Pin the Extension (Recommended)

**All Browsers:**
1. Click the puzzle piece icon 🧩 in your toolbar
2. Find "Smart Bookmark Organizer"
3. Click the pin icon 📌 to keep it visible in the toolbar

---

## 🎯 First-Time Setup

### 1. Open the Organizer

- Click the extension icon in the toolbar
- Or press `Ctrl+Shift+B`

### 2. Configure Settings

1. Click the **⚙️ Settings** button (top-right)
2. Configure your preferences:
   - **Theme:** Light, Dark, or Auto (follows system)
   - **Default Sort:** Choose how bookmarks are sorted by default
   - **Auto-backup:** Enable weekly automatic backups

### 3. Save Your First Bookmark

**Method 1: Context Menu**
1. Find a link on any webpage
2. Right-click the link
3. Select **"Save Link as Bookmark"**
4. You'll see a success notification ✅

**Method 2: Keyboard Shortcut**
1. Hover your mouse over a link
2. Press `Ctrl+Shift+S`
3. Bookmark is saved instantly

**Method 3: Current Page**
1. Navigate to any webpage
2. Press `Ctrl+Shift+S` (without hovering on a link)
3. Current page is saved as a bookmark

### 4. Organize Your Bookmark

1. Click **✏️ Edit** on the bookmark
2. Add useful information:
   - **Tags:** Type tags and press Enter (e.g., "work", "important")
   - **Folder:** Assign to a folder (e.g., "Work Documents")
   - **Notes:** Add personal notes
   - **Favorite:** Click the star ⭐ to mark as favorite
3. Click **Save**

---

## 🎓 Quick Tutorial

### Basic Workflow

```
1. Browse → 2. Right-click link → 3. "Save Link as Bookmark"
              ↓
4. Open organizer → 5. Edit bookmark → 6. Add tags, folder, notes
              ↓
7. Search/Filter → 8. Find bookmark → 9. Click to open
```

### Common Tasks

**Find a Bookmark:**
- Use the search box (searches name, domain, tags, notes)
- Filter by file type (PDF, ZIP, etc.)
- Filter by folder using dropdown
- Sort by date, name, usage, or domain

**Organize Multiple Bookmarks:**
1. Click **☑️ Bulk** button
2. Select multiple bookmarks with checkboxes
3. Choose an action:
   - Delete Selected
   - Add Tags
   - Set Folder
   - Export Selected

**View Statistics:**
1. Click **📊 Stats** button
2. View your bookmark collection insights:
   - Total bookmarks and favorites
   - Top file types and domains
   - Popular tags
   - Most-used bookmarks

**Switch to Dark Mode:**
1. Click the **🌓** moon icon (top-right)
2. Theme switches instantly
3. Your choice is remembered

---

## 🧪 Test the Extension

### Using the Test Page

1. Open `test.html` from the extension folder in your browser
2. The page contains sample links for testing
3. Right-click any link → "Save Link as Bookmark"
4. Open the organizer to see your saved bookmarks
5. Test all features:
   - Search
   - Filter
   - Sort
   - Edit
   - Tags
   - Folders
   - Favorites
   - Bulk operations

---

## 🔧 Troubleshooting

### Extension Not Showing in Toolbar
- Click the puzzle icon 🧩
- Find "Smart Bookmark Organizer"
- Click the pin icon 📌

### Context Menu Not Appearing
- Ensure the extension is enabled in `chrome://extensions/`
- Try reloading the extension (toggle off/on)
- Refresh the webpage you're testing on

### Keyboard Shortcuts Not Working
- Check if shortcuts conflict with other extensions
- Go to `chrome://extensions/shortcuts` and verify
- Ensure you're focused on a link when pressing the shortcut

### Icons Not Showing
- Run `python create_icons.py` to generate icons
- Reload the extension after generating icons
- Check that `icons/` folder contains PNG files

### Bookmarks Not Saving
- Open browser console (F12)
- Look for error messages
- Check if IndexedDB is enabled in browser settings
- Try clearing browser data and reinstalling

### Firefox Temporary Add-on Removed
- This is normal behavior - temporary add-ons are removed on restart
- Either reload each time or submit to AMO for permanent installation

---

## 📦 Data Management

### Export Your Data

1. Open the organizer
2. Click **📤 Export** button
3. Select format:
   - **JSON:** Complete backup with all metadata
   - **CSV:** Spreadsheet-compatible
   - **HTML:** Standard browser bookmark format
4. Choose location to save
5. Your data is backed up! 🎉

### Import Data

1. Click **📥 Import** button
2. Select a previously exported JSON file
3. Bookmarks are imported (duplicates automatically skipped)
4. View import summary

### Automatic Backups

1. Open **⚙️ Settings**
2. Enable **"Auto-backup (Weekly)"**
3. Backups are created automatically every 7 days
4. Files saved to your Downloads folder

---

## 🚀 Advanced Configuration

### Custom File Type Support

Edit [db.js](../db.js) to add custom file type icons:

```javascript
// Around line 150
getFileTypeIcon(fileType) {
  const icons = {
    'pdf': '📄',
    'zip': '📦',
    'exe': '⚙️',
    'custom': '🎯'  // Add your custom type
  };
  return icons[fileType] || '📎';
}
```

### Adjust Search Debounce

Edit [popup.js](../popup.js) to change search delay:

```javascript
// Around line 50
searchInput.addEventListener('input', debounce(async (e) => {
  // ...search logic
}, 300)); // Change 300ms to your preferred delay
```

---

## 📚 Next Steps

1. ✅ Read the [User Guide](./USER_GUIDE.md) for detailed feature explanations
2. ✅ Check [FEATURES.md](./FEATURES.md) for complete feature list
3. ✅ Review [TECHNICAL.md](./TECHNICAL.md) for architecture details
4. ✅ See [CHANGELOG.md](./CHANGELOG.md) for version history

---

## 🆘 Getting Help

**Documentation:**
- [User Guide](./USER_GUIDE.md) - Complete feature walkthrough
- [Technical Docs](./TECHNICAL.md) - Architecture and API
- [Features List](./FEATURES.md) - All features explained

**Issues:**
- Check existing documentation first
- Open an issue on GitHub with:
  - Browser and version
  - Extension version
  - Steps to reproduce
  - Error messages (if any)

---

**Installation Complete! Start organizing your bookmarks efficiently. 🎉**
   - Use 🗑️ to delete bookmarks

### Export & Import

**Export** (Backup):
- Click "📤 Export"
- Save the JSON file to a safe location

**Import** (Restore):
- Click "📥 Import"
- Select your JSON backup file
- Duplicates are automatically skipped!

## Troubleshooting

### Extension icon not showing
- Look for the puzzle piece 🧩 icon in your toolbar
- Click it and pin the extension

### Icons showing as placeholders
- Create PNG icon files (see `icons/README.md`)
- Reload the extension after adding icons

### Keyboard shortcut conflicts
- Go to extension shortcuts settings
- Change to a different combination
- Common alternatives: `Ctrl+Alt+S`, `Ctrl+Shift+D`

### Context menu not appearing
- Ensure you're right-clicking on a **link** (not just text)
- Check if the extension is enabled in extensions page
- Try reloading the extension

### Bookmarks not saving
- Open browser console (F12)
- Check for any error messages
- Ensure you have storage space available

### Firefox temporary add-on removed
- Reload it via `about:debugging` each time you restart
- For permanent installation, submit to AMO

## Testing the Extension

Try these test cases:

1. **PDF Link**: Right-click a PDF link → Save → Open organizer → Verify it appears
2. **Duplicate**: Try saving the same link twice → Should show "duplicate" notification
3. **Search**: Save multiple bookmarks → Search by domain name
4. **Filter**: Save different file types → Filter by .pdf or .zip
5. **Export/Import**: Export → Delete all → Import → Verify all restored
6. **Usage Count**: Open a bookmark 3 times → Check usage count increases

## Next Steps

✅ Extension is working!

Now you can:
- Start organizing your download links
- Customize keyboard shortcuts
- Export regular backups
- Share your bookmark collection with others

## Need Help?

- Check the main `README.md` for detailed documentation
- Review `icons/README.md` for icon creation help
- Check browser console for error messages
- Ensure all files are in the correct locations

---

**Happy organizing! 📚✨**
