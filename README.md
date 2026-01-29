# 🔖 Smart Bookmark Organizer

> **A powerful browser extension for organizing and managing your bookmarks with advanced features like tags, folders, right-click context menus, dark mode, and bulk operations.**

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](./docs/CHANGELOG.md)
[![Browser](https://img.shields.io/badge/browser-Chrome%20%7C%20Firefox%20%7C%20Edge-green.svg)]()
[![Manifest](https://img.shields.io/badge/manifest-V3-orange.svg)]()
[![Author](https://img.shields.io/badge/created%20by-Mr.H1deZ-purple.svg)]()

---

## ✨ Key Features

### 🎯 Core Features
- **Save with Modal** - Right-click any link or page, choose folder, edit title, add tags before saving
- **Folder Sidebar** - Visual folder list with one-click filtering
- **Right-Click Context Menu** - Access Open, Edit, Copy, Delete from bookmark list
- **Smart Search** - Find bookmarks by name, domain, tags, notes, or regex
- **Tags System** - Organize with unlimited tags and autocomplete
- **Folder Management** - Create, organize, and delete folders
- **Favorites** - Star important bookmarks for quick access
- **Notes** - Add personal notes to any bookmark
- **Dark Mode** - Beautiful theme with full UI support including folder sidebar

### 🚀 Advanced Features
- **Custom Save Dialog** - Select folder, edit name, add tags before saving any bookmark
- **Folder Storage** - Persistent folder creation with custom folder storage
- **Bulk Operations** - Select, delete, tag, or organize multiple bookmarks
- **Statistics Dashboard** - Charts, counts, and insights
- **Advanced Filters** - Date range, usage stats, regex search, folder filtering
- **Multi-Format Export** - JSON, CSV, HTML
- **Duplicate Detection** - Automatic detection and prevention
- **Usage Tracking** - See your most-used bookmarks
- **Page Type Detection** - Automatically classifies pages vs file types

---

## 📥 Installation

### Development Mode (Unpacked Extension)

#### Chrome / Edge / Brave

1. Download or clone this repository
2. Open `chrome://extensions/` (or `edge://extensions/`, `brave://extensions/`)
3. Enable **Developer Mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the `Bookmark_organizer` folder

#### Firefox

1. Download or clone this repository
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select `manifest.json` from the folder

> **Note:** Firefox temporary extensions are removed on browser restart. For permanent installation, see "Creating a Packed Extension" below.

### Creating a Packed Extension

#### For Chrome/Edge/Brave (.crx file):

1. Open `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Pack extension**
4. Select the `Bookmark_organizer` folder as **Extension root directory**
5. Leave **Private key file** empty (first time)
6. Click **Pack Extension**
7. You'll get two files:
   - `Bookmark_organizer.crx` (the packed extension)
   - `Bookmark_organizer.pem` (private key - keep this safe!)

**To install the .crx file:**
- Drag and drop the `.crx` file onto `chrome://extensions/`
- Or: Extract the `.crx` file and load it as unpacked

#### For Firefox (.xpi file):

1. Install `web-ext`:
```bash
npm install -g web-ext
```

2. Build the extension:
```bash
cd Bookmark_organizer
web-ext build
```

3. The `.xpi` file will be created in `web-ext-artifacts/`

4. Install:
   - **Temporary:** Open `about:debugging`, click "Load Temporary Add-on", select the `.xpi`
   - **Permanent:** Submit to [addons.mozilla.org](https://addons.mozilla.org) for signing

#### Manual ZIP Method (Any Browser):

1. Create a ZIP file of the extension folder (exclude `.git`, `.venv`, test files)
```bash
# On Windows PowerShell:
Compress-Archive -Path * -DestinationPath bookmark-organizer.zip -Exclude .git,.venv,test.html,.gitattributes

# On Linux/Mac:
zip -r bookmark-organizer.zip . -x "*.git*" "*.venv*" "*test.html" "*.pyc"
```

2. Rename `.zip` to `.crx` (Chrome) or `.xpi` (Firefox)

### Generate Icons (If needed)

```bash
pip install pillow
python create_icons.py
```

---

## 🎯 Quick Start

### Save a Bookmark

#### Option 1: Save with Custom Settings (Recommended)
1. Right-click any link → "Save Link as Bookmark"
2. Or right-click anywhere on page → "Save This Page as Bookmark"
3. Modal appears with options:
   - Edit bookmark title
   - Select folder from dropdown
   - Add comma-separated tags
4. Click **Save**

#### Option 2: Quick Save Button
1. Click extension icon (or press `Ctrl+Shift+B`)
2. Click **💾 Save Page** button
3. Same modal appears with current page info

#### Option 3: Keyboard Shortcut
- Hover over a link + press `Ctrl+Shift+S` (quick save with defaults)

### Browse Your Bookmarks

- **Folder Sidebar** - Click any folder to filter bookmarks
- **Search Box** - Type to search across all fields
- **Filter Dropdowns** - Select file type, folder, or sort order
- **Right-Click Menu** - Right-click any bookmark for:
  - 🔗 Open (in new tab)
  - ✏️ Edit (title, folder, tags, notes, favorite)
  - 📋 Copy URL
  - 🗑️ Delete

### Manage Folders

1. Click **📁 Folders** button
2. Type folder name and click **Create**
3. Folders appear in:
   - Folder sidebar (left panel)
   - Save bookmark modal dropdown
   - Edit bookmark dropdown
   - Filter dropdown
4. Delete folders from the Folders modal

### Basic Operations
```
🔍 Search    - Type to search by name, domain, tags, notes
📁 Sidebar   - Click folder to filter instantly
📋 Filter    - Select file type or folder from dropdown
⬆️ Sort      - By date, name, usage, or domain
✏️ Edit      - Right-click → Edit to modify everything
⭐ Favorite  - Click star icon on any bookmark
🗑️ Delete    - Right-click → Delete
```

### Advanced Operations
```
🏷️ Tags      - Add multiple tags with autocomplete suggestions
📦 Bulk Mode - Select multiple bookmarks for batch operations
🌓 Dark Mode - Toggle in top-right (affects all UI including folders)
📊 Stats     - View dashboard with charts and insights
⚙️ Settings  - Customize theme, sort, backup options
📤 Export    - Download as JSON, CSV, or HTML
📥 Import    - Upload JSON file to restore bookmarks
```

---

## 💡 Feature Highlights

### Folder System
- **Visual Sidebar** - See all folders at a glance
- **One-Click Filtering** - Click any folder to filter bookmarks
- **Persistent Storage** - Folders stored in browser settings
- **Edit with Dropdown** - Select folder from dropdown when editing
- **Save with Folder** - Choose folder before saving any bookmark
- **Dark Mode Support** - Sidebar colors adapt to theme

### Context Menu System
- **Right-Click to Save** - Two context menu options:
  - "Save Link as Bookmark" (on links)
  - "Save This Page as Bookmark" (on page)
- **Right-Click on Bookmarks** - Clean context menu instead of visible buttons:
  - Open, Edit, Copy URL, Delete
- **Modal-Based Saving** - Choose folder, edit title, add tags before saving

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
├── manifest.json           # Extension configuration (v3.0.0, Manifest V3)
├── background.js           # Service worker (context menu, keyboard shortcuts, save logic)
├── content.js              # Content script (focused link detection)
├── db.js                   # IndexedDB wrapper (v2 schema with folder storage)
├── popup.html              # Main UI interface (with folder sidebar)
├── popup.css               # Styles (1000+ lines, full dark mode support)
├── popup.js                # UI controller (1300+ lines, context menus, folder management)
├── icons/                  # Extension icons (16/32/48/128px)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   └── README.md
├── create_icons.py         # Icon generator script (Python/Pillow)
├── test.html              # Test page with sample links
├── .git/                  # Git repository
├── .venv/                 # Python virtual environment (optional)
└── docs/                   # Documentation
    ├── README.md           # Documentation index
    ├── CHANGELOG.md        # Version history
    ├── FEATURES.md         # Feature checklist (85%+ complete)
    ├── SETUP.md           # Detailed setup guide
    ├── USER_GUIDE.md      # Complete usage guide
    ├── TECHNICAL.md       # Technical documentation (665 lines)
    └── IMPLEMENTATION_COMPLETE.md  # v2.0 implementation summary
```

---

## 🔧 Technology Stack

| Component | Technology | Details |
|-----------|-----------|---------|
| **Manifest** | V3 | Modern standard, service worker |
| **Storage** | IndexedDB v2 | Local database with folder storage |
| **Frontend** | Vanilla JavaScript (ES6+) | No frameworks, pure JS |
| **Styling** | CSS3 | Flexbox, Grid, CSS Variables, Animations |
| **Background** | Service Worker | Manifest V3 compliant |
| **Browser Support** | Chrome 88+, Firefox 109+, Edge 88+ | Chromium-based + Firefox |
| **Icons** | Python (Pillow) | Programmatically generated |
| **Dark Mode** | CSS Variables | Full UI support including folder sidebar |

---

## 📊 Database Schema

```javascript
// Bookmarks Store (v2 schema)
{
  id: number,              // Auto-increment primary key
  url: string,             // Bookmark URL (indexed, unique)
  title: string,           // Display title
  filename: string,        // Extracted filename (indexed)
  domain: string,          // Domain name (indexed)
  fileType: string,        // File extension or 'page' (indexed)
  dateAdded: timestamp,    // Creation date (indexed)
  usageCount: number,      // Access counter
  tags: array,             // Tags list []
  favorite: boolean,       // Favorite status (indexed)
  notes: string,           // Personal notes
  folder: string | null    // Folder name (indexed, nullable)
}

// Settings Store
{
  key: string,             // Setting name (primary key)
  value: any               // Setting value
}

// Custom settings stored:
{
  theme: 'light' | 'dark' | 'auto',
  defaultSort: string,
  customFolders: string[]   // Persistent folder names
}
```

---

## 🚀 Usage Examples

### Scenario 1: Saving with Custom Settings
```
1. Right-click any page → "Save This Page as Bookmark"
2. Modal opens with pre-filled title
3. Select folder from dropdown (e.g., "Work Documents")
4. Edit title to "Q1 Report 2026"
5. Add tags: "work, reports, 2026" (comma-separated)
6. Click Save
7. Bookmark appears in folder sidebar
```

### Scenario 2: Organizing Work Documents
```
1. Click 📁 Folders button
2. Create folders: "Work", "Personal", "Archive"
3. Right-click links and save to appropriate folders
4. Use folder sidebar to filter by folder
5. Star important documents
6. Add notes via right-click → Edit
```

### Scenario 3: Bulk Organization
```
1. Enable Bulk Mode (☑️ button)
2. Check multiple bookmarks
3. Click "Set Folder" → Select "Archive"
4. Click "Add Tags" → Enter "old, reviewed"
5. Disable Bulk Mode
```

### Scenario 4: Finding Old Bookmarks
```
1. Click 🔍 (Advanced Search)
2. Set date range: Last 6 months
3. Check "Favorites Only"
4. Select folder: "Work"
5. Results show starred items from folder in date range
```

---

## ⌨️ Keyboard Shortcuts

| Action | Windows/Linux | Mac | Customizable |
|--------|---------------|-----|--------------|
| **Save Focused Link** | `Ctrl+Shift+S` | `Cmd+Shift+S` | Yes |
| **Open Organizer** | `Ctrl+Shift+B` | `Cmd+Shift+B` | Yes |

**To customize:**
- **Chrome/Edge:** Navigate to `chrome://extensions/shortcuts`
- **Firefox:** Go to `about:addons` → Gear icon → "Manage Extension Shortcuts"

---

## 📤 Export & Backup

### Export Formats

**JSON** - Complete backup with all metadata
```json
[
  {
    "url": "https://example.com/doc.pdf",
    "title": "Important Document",
    "filename": "doc.pdf",
    "domain": "example.com",
    "fileType": "pdf",
    "tags": ["work", "important"],
    "folder": "Work Documents",
    "favorite": true,
    "notes": "Review by Friday",
    "dateAdded": 1706486400000,
    "usageCount": 5
  }
]
```

**CSV** - Spreadsheet compatible
```csv
Title,URL,Domain,File Type,Tags,Folder,Favorite,Notes,Date Added,Usage Count
Important Document,https://example.com/doc.pdf,example.com,pdf,"work,important",Work Documents,true,Review by Friday,2026-01-29,5
```

**HTML** - Standard browser bookmark format (Netscape Bookmark File)
```html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
<DT><A HREF="https://example.com/doc.pdf" ADD_DATE="1706486400">Important Document</A>
</DL><p>
```

### Backup Options
1. **Manual Export:** Click **📤 Export** → Choose format → Download
2. **Bulk Export:** Select bookmarks in Bulk Mode → Click "Export Selected"
3. **Import:** Click **📥 Import** → Select JSON file → Bookmarks restored

---

## 🔒 Privacy & Security

- ✅ **100% Local Storage** - All data stored in IndexedDB on your device only
- ✅ **Zero Network Activity** - No external connections, APIs, or cloud services
- ✅ **No Tracking** - No analytics, telemetry, or usage statistics collected
- ✅ **Minimal Permissions** - Only essential permissions requested
- ✅ **XSS Protection** - All user input sanitized with `escapeHtml()`
- ✅ **Open Source** - Complete code transparency for security review
- ✅ **No Third-Party Libraries** - Pure vanilla JavaScript, no external dependencies

**Permissions Used:**
- `contextMenus` - Right-click context menu
- `storage` - Settings persistence
- `notifications` - Save confirmations
- `tabs` - Get current page info

---

## 📚 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Detailed installation and configuration
- **[User Guide](./docs/USER_GUIDE.md)** - Complete feature walkthrough with screenshots
- **[Changelog](./docs/CHANGELOG.md)** - Version history and what's new
- **[Technical Docs](./docs/TECHNICAL.md)** - Architecture, API reference, 665 lines
- **[Features List](./docs/FEATURES.md)** - Feature checklist and completion status
- **[Implementation Notes](./docs/IMPLEMENTATION_COMPLETE.md)** - v2.0 development summary

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

### v3.0.0 (Current)
Complete feature overhaul with tags, folders, dark mode, bulk operations, statistics, and advanced search.

### v1.0.0
Initial release with basic bookmark saving, search, filter, sort, and export features.

See [CHANGELOG.md](./docs/CHANGELOG.md) for detailed history.

---

**Made with ❤️ for productivity enthusiasts By Mr.H1deZ**

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

Made with ❤️ by Mr.H1deZ
 
## 📧 Support

If you encounter issues or have suggestions, please open an issue on the project repository.

---

**Enjoy organizing your bookmarks! 📚✨**
