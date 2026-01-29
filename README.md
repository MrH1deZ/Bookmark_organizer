# 🔖 Smart Bookmark Organizer

> **A powerful browser extension for organizing and managing your bookmarks with advanced features like tags, folders, dark mode, and bulk operations.**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](./docs/CHANGELOG.md)
[![Browser](https://img.shields.io/badge/browser-Chrome%20%7C%20Firefox%20%7C%20Edge-green.svg)]()
[![Manifest](https://img.shields.io/badge/manifest-V3-orange.svg)]()

---

## ✨ Key Features

### 🎯 Core Features
- **One-Click Saving** - Right-click any link or press `Ctrl+Shift+S`
- **Smart Search** - Find bookmarks by name, domain, tags, notes, or regex
- **Tags System** - Organize with unlimited tags and autocomplete
- **Folder Organization** - Create folders and categorize bookmarks
- **Favorites** - Star important bookmarks for quick access
- **Notes** - Add personal notes to any bookmark
- **Dark Mode** - Beautiful theme with persistence

### 🚀 Advanced Features
- **Bulk Operations** - Select, delete, tag, or organize multiple bookmarks
- **Statistics Dashboard** - Charts, counts, and insights
- **Advanced Filters** - Date range, usage stats, regex search
- **Multi-Format Export** - JSON, CSV, HTML
- **Duplicate Detection** - Automatic detection and prevention
- **Usage Tracking** - See your most-used bookmarks

---

## 📥 Installation

### Chrome / Edge / Brave

1. Download or clone this repository
2. Open `chrome://extensions/` (or `edge://extensions/`, `brave://extensions/`)
3. Enable **Developer Mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the `Bookmark_organizer` folder

### Firefox

1. Download or clone this repository
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select `manifest.json` from the folder

> **Note:** For permanent Firefox installation, submit to [addons.mozilla.org](https://addons.mozilla.org)

### Generate Icons (Optional)

```bash
pip install pillow
python create_icons.py
```

---

## 🎯 Quick Start

### Save a Bookmark
- **Method 1:** Right-click any link → "Save Link as Bookmark"
- **Method 2:** Hover over a link + press `Ctrl+Shift+S`
- **Method 3:** Press `Ctrl+Shift+S` on current page

### Open Organizer
- Click the extension icon in toolbar
- Or press `Ctrl+Shift+B`

### Basic Operations
```
🔍 Search    - Type to search by name, domain, tags, notes
📁 Filter    - Select file type or folder
⬆️ Sort      - By date, name, usage, or domain
✏️ Edit      - Modify title, tags, folder, notes, favorite
⭐ Favorite  - Click star to mark as favorite
🗑️ Delete    - Remove individual bookmarks
```

### Advanced Operations
```
🏷️ Tags      - Add multiple tags with autocomplete
📦 Bulk Mode - Select multiple bookmarks for batch operations
🌓 Dark Mode - Toggle in top-right corner
📊 Stats     - View dashboard with charts and insights
⚙️ Settings  - Customize theme, sort, backup options
📤 Export    - Download as JSON, CSV, or HTML
```

---

## 💡 Feature Highlights

### Tags System
- Add unlimited tags to any bookmark
- Autocomplete suggestions from existing tags
- Multi-tag filtering (AND logic)
- Click any tag to filter instantly
- View popular tags in statistics

### Folder Organization
- Create custom folders (e.g., "Work", "Personal")
- Assign bookmarks to folders
- Filter by folder quickly
- Autocomplete for existing folders
- Bulk folder assignment

### Bulk Operations
1. Click **☑️ Bulk** button
2. Select multiple bookmarks with checkboxes
3. Choose operation:
   - **Delete Selected** - Remove multiple at once
   - **Add Tags** - Tag multiple bookmarks
   - **Set Folder** - Organize into folders
   - **Export Selected** - Download selection only

### Statistics Dashboard
- Total bookmarks, favorites, recent activity
- Top file types chart
- Top domains chart
- Popular tags list
- Most-used bookmarks
- Weekly/monthly insights

### Advanced Search
- **Regex Support** - Pattern matching for power users
- **Favorites Filter** - Show only starred items
- **Date Range** - Find bookmarks by date added
- **Usage Range** - Filter by access frequency
- **Combined Filters** - Use multiple filters together

---

## 🎨 Interface

### Light Mode
Clean, modern interface with gradient accents and smooth animations.

### Dark Mode
Eye-friendly dark theme with carefully chosen colors for comfortable night-time use.

---

## 📁 Project Structure

```
Bookmark_organizer/
├── manifest.json           # Extension configuration (v2.0.0)
├── background.js           # Service worker (context menu, shortcuts)
├── content.js              # Content script (link detection)
├── db.js                   # IndexedDB wrapper (v2 schema)
├── popup.html              # Main UI interface
├── popup.css               # Styles (900+ lines, dark mode)
├── popup.js                # UI controller (1000+ lines)
├── icons/                  # Extension icons (16/32/48/128px)
├── create_icons.py         # Icon generator script
├── test.html              # Test page with sample links
└── docs/                   # Documentation
    ├── CHANGELOG.md        # Version history
    ├── FEATURES.md         # Feature checklist
    ├── SETUP.md           # Detailed setup guide
    ├── USER_GUIDE.md      # Complete usage guide
    └── TECHNICAL.md       # Technical documentation
```

---

## 🔧 Technology Stack

| Component | Technology |
|-----------|-----------|
| **Manifest** | V3 (Modern Standard) |
| **Storage** | IndexedDB v2 |
| **Frontend** | Vanilla JavaScript (ES6+) |
| **Styling** | CSS3 (Flexbox, Grid, Animations) |
| **Background** | Service Worker |
| **Browser Support** | Chrome, Firefox, Edge, Brave |
| **Icons** | Python (Pillow) |

---

## 📊 Database Schema

```javascript
// Bookmarks Store (v2)
{
  id: number,              // Auto-increment primary key
  url: string,             // Bookmark URL (indexed, unique)
  title: string,           // Display title
  filename: string,        // Extracted filename (indexed)
  domain: string,          // Domain name (indexed)
  fileType: string,        // File extension (indexed)
  dateAdded: timestamp,    // Creation date (indexed)
  usageCount: number,      // Access counter
  tags: array,             // Tags list
  favorite: boolean,       // Favorite status (indexed)
  notes: string,           // Personal notes
  folder: string           // Folder name (indexed)
}

// Settings Store
{
  key: string,             // Setting name (primary key)
  value: any               // Setting value
}
```

---

## 🚀 Usage Examples

### Scenario 1: Organizing Work Documents
```
1. Save PDFs with right-click → "Save Link as Bookmark"
2. Edit each bookmark → Add tags: "work", "reports", "2026"
3. Set folder: "Work Documents"
4. Star important ones
5. Filter by folder "Work Documents"
6. Sort by date added
```

### Scenario 2: Bulk Organization
```
1. Enable Bulk Mode (☑️ button)
2. Select all PDFs from last month
3. Click "Add Tags" → Enter "archived"
4. Click "Set Folder" → Enter "Archive"
5. Disable Bulk Mode
```

### Scenario 3: Finding Old Bookmarks
```
1. Click 🔍 (Advanced Search)
2. Set date range: Last 6 months
3. Check "Favorites Only"
4. Enter tag: "important"
5. Results show starred items from last 6 months with "important" tag
```

---

## ⌨️ Keyboard Shortcuts

| Action | Default Shortcut | Customizable |
|--------|-----------------|--------------|
| **Save Bookmark** | `Ctrl+Shift+S` | Yes |
| **Open Organizer** | `Ctrl+Shift+B` | Yes |

**To customize:**
- Chrome: `chrome://extensions/shortcuts`
- Firefox: `about:addons` → Gear icon → "Manage Extension Shortcuts"

---

## 📤 Export & Backup

### Export Formats

**JSON** - Complete backup with all metadata
```json
{
  "url": "https://example.com/file.pdf",
  "title": "Document",
  "tags": ["work", "important"],
  "folder": "Work",
  "favorite": true,
  "notes": "Review by Friday"
}
```

**CSV** - Spreadsheet compatible
```csv
Title,URL,Domain,File Type,Tags,Folder,Favorite,Notes,Date Added,Usage Count
```

**HTML** - Standard browser bookmark format
```html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<DT><A HREF="...">Title</A>
```

### Automatic Backups
1. Click **⚙️ Settings**
2. Enable "Auto-backup (Weekly)"
3. Backups saved automatically as JSON

---

## 🔒 Privacy & Security

- ✅ **Local Storage Only** - All data stored in IndexedDB on your device
- ✅ **No External Connections** - Zero network requests
- ✅ **No Tracking** - No analytics or telemetry
- ✅ **No Permissions Abuse** - Minimal required permissions
- ✅ **XSS Protection** - Sanitized output and input validation
- ✅ **Open Source** - Transparent code for review

---

## 📚 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Detailed installation instructions
- **[User Guide](./docs/USER_GUIDE.md)** - Complete feature walkthrough
- **[Changelog](./docs/CHANGELOG.md)** - Version history and updates
- **[Technical Docs](./docs/TECHNICAL.md)** - Architecture and API reference
- **[Features List](./docs/FEATURES.md)** - Feature checklist and roadmap

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## 📝 License

This project is licensed under the MIT License.

---

## 🆘 Support

**Issues?**
- Check the [User Guide](./docs/USER_GUIDE.md)
- Review [Technical Documentation](./docs/TECHNICAL.md)
- Open an issue on GitHub

---

## 🎉 Version History

### v2.0.0 (Current)
Complete feature overhaul with tags, folders, dark mode, bulk operations, statistics, and advanced search.

### v1.0.0
Initial release with basic bookmark saving, search, filter, sort, and export features.

See [CHANGELOG.md](./docs/CHANGELOG.md) for detailed history.

---

**Made with ❤️ for productivity enthusiasts**

### Performance
- Optimized rendering for large collections
- Efficient database queries with indexes
- Debounced search input (300ms)

### Security
- No external connections
- All data stored locally
- XSS protection via HTML escaping

## 📝 Data Format

Each bookmark contains:
```javascript
{
  id: 1,                    // Auto-generated
  url: "https://...",       // Full URL
  filename: "file.pdf",     // Extracted filename
  domain: "example.com",    // Domain name
  fileType: "pdf",          // File extension
  title: "file.pdf",        // Display title
  dateAdded: 1234567890,    // Timestamp
  usageCount: 5,            // Number of times opened
  tags: ["work", "docs"]    // Custom tags (future)
}
```

## 🚀 Future Enhancements

- [ ] Custom tags for bookmarks
- [ ] Bulk operations (select multiple)
- [ ] Folder organization
- [ ] Cloud sync options
- [ ] Browser bookmark import
- [ ] Advanced search operators
- [ ] Custom keyboard shortcuts per action
- [ ] Dark mode
- [ ] Statistics dashboard

## 🐛 Troubleshooting

### Extension not loading
- Check that all files are in the correct location
- Ensure manifest.json is valid JSON
- Check browser console for errors

### Keyboard shortcut not working
- Check if another extension is using the same shortcut
- Verify the shortcut in browser extension settings
- Make sure you're hovering over a link or on a page with links

### Bookmarks not saving
- Check browser console for errors
- Verify IndexedDB is enabled in your browser
- Check if you have sufficient storage space

## 📄 License

This project is provided as-is for personal and educational use.

## 🤝 Contributing

Feel free to fork, modify, and improve this extension. If you add cool features, consider sharing them back!

## 📧 Support

If you encounter issues or have suggestions, please open an issue on the project repository.

---

**Enjoy organizing your bookmarks! 📚✨**
