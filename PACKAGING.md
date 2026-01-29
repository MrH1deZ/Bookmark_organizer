# 📦 Extension Packaging Guide

This guide explains how to package the Smart Bookmark Organizer extension for distribution.

---

## 📋 Table of Contents

1. [Chrome/Edge/Brave (.crx)](#chromeedgebrave-crx)
2. [Firefox (.xpi)](#firefox-xpi)
3. [Manual ZIP Method](#manual-zip-method)
4. [Publishing to Stores](#publishing-to-stores)
5. [Version Management](#version-management)

---

## Chrome/Edge/Brave (.crx)

### Method 1: Using Chrome's Built-in Packer

1. **Open Extensions Page:**
   ```
   chrome://extensions/
   edge://extensions/
   brave://extensions/
   ```

2. **Enable Developer Mode:**
   - Toggle switch in top-right corner

3. **Pack Extension:**
   - Click "Pack extension" button
   - **Extension root directory:** Browse to `Bookmark_organizer` folder
   - **Private key file:** Leave empty (first time only)
   - Click "Pack Extension"

4. **Output Files:**
   ```
   Bookmark_organizer.crx    # The packed extension
   Bookmark_organizer.pem    # Private key (KEEP SAFE!)
   ```

5. **For Updates:**
   - Use the same `.pem` file for future versions
   - This maintains the same extension ID

### Method 2: Command Line (Advanced)

```bash
# Using Chrome binary directly
chrome --pack-extension="C:\path\to\Bookmark_organizer" --pack-extension-key="C:\path\to\Bookmark_organizer.pem"

# Using Chromium
chromium --pack-extension="/path/to/Bookmark_organizer"
```

### Installing .crx Files

**Note:** Modern Chrome blocks direct .crx installation for security.

**Options:**
1. **Developer Mode:** Drag `.crx` to `chrome://extensions/`
2. **Unpack .crx:** Extract as ZIP, load as unpacked
3. **Chrome Web Store:** Official distribution (recommended)

---

## Firefox (.xpi)

### Prerequisites

Install `web-ext` tool:

```bash
# Using npm
npm install -g web-ext

# Using yarn
yarn global add web-ext
```

### Build Extension

```bash
# Navigate to extension directory
cd Bookmark_organizer

# Build .xpi file
web-ext build

# Output: web-ext-artifacts/smart_bookmark_organizer-3.0.0.xpi
```

### Advanced Options

```bash
# Build with custom output directory
web-ext build --artifacts-dir ./dist

# Build and overwrite existing
web-ext build --overwrite-dest

# Build for specific Firefox version
web-ext build --as-needed
```

### Testing Before Building

```bash
# Run in temporary Firefox profile
web-ext run

# Run in specific Firefox binary
web-ext run --firefox="/path/to/firefox"

# Run and auto-reload on changes
web-ext run --reload
```

### Installing .xpi Files

**Temporary Installation (Development):**
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `.xpi` file
4. *Note:* Removed on browser restart

**Permanent Installation:**
- Sign the extension at [addons.mozilla.org](https://addons.mozilla.org/developers/)
- Or disable signature verification (not recommended):
  - Navigate to `about:config`
  - Set `xpinstall.signatures.required` to `false`

---

## Manual ZIP Method

Works for any browser, creates portable archive.

### Windows (PowerShell)

```powershell
# Navigate to parent directory
cd "C:\Users\...\Desktop\scripts"

# Create ZIP excluding unnecessary files
Compress-Archive -Path "Bookmark_organizer\*" -DestinationPath "bookmark-organizer-v3.0.0.zip" -Force -CompressionLevel Optimal

# Or with exclusions
Get-ChildItem "Bookmark_organizer" -Recurse | 
  Where-Object { $_.FullName -notmatch '\.(git|venv|pyc)' } | 
  Compress-Archive -DestinationPath "bookmark-organizer-v3.0.0.zip"
```

### Linux/Mac (Terminal)

```bash
# Navigate to parent directory
cd ~/Desktop/scripts

# Create ZIP with exclusions
zip -r bookmark-organizer-v3.0.0.zip Bookmark_organizer \
  -x "*.git*" "*.venv*" "*__pycache__*" "*.pyc" "*test.html" "*.md" ".gitattributes"

# Verify contents
unzip -l bookmark-organizer-v3.0.0.zip
```

### What to Include

**Essential Files:**
```
✅ manifest.json
✅ background.js
✅ content.js
✅ db.js
✅ popup.html
✅ popup.css
✅ popup.js
✅ icons/ (all PNG files)
```

**Exclude:**
```
❌ .git/
❌ .venv/
❌ .gitattributes
❌ test.html
❌ create_icons.py
❌ *.md files (optional)
❌ __pycache__/
❌ *.pyc
❌ .DS_Store (Mac)
❌ Thumbs.db (Windows)
```

### Converting ZIP to Browser Format

```bash
# For Chrome (.crx) - must use Chrome packer
# .crx is signed, can't just rename

# For Firefox (.xpi)
mv bookmark-organizer-v3.0.0.zip bookmark-organizer-v3.0.0.xpi
```

---

## Publishing to Stores

### Chrome Web Store

1. **Create Developer Account:**
   - Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 registration fee

2. **Prepare Assets:**
   - Extension ZIP file
   - Screenshots (1280x800 or 640x400)
   - Promotional images (440x280 small tile, optional 1400x560 marquee)
   - Detailed description
   - Privacy policy (if collecting data)

3. **Upload:**
   - Click "New Item"
   - Upload ZIP file
   - Fill in listing details
   - Set pricing (free or paid)
   - Submit for review

4. **Review Process:**
   - Usually 1-3 business days
   - May request changes
   - Approved extensions go live immediately

### Firefox Add-ons

1. **Create Account:**
   - Visit [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
   - Free registration

2. **Submit Extension:**
   - Click "Submit a New Add-on"
   - Upload `.xpi` file or ZIP
   - Choose distribution:
     - **Listed:** Appears in public add-ons store
     - **Unlisted:** Direct download link only

3. **Fill Details:**
   - Name, description, categories
   - Screenshots and icon
   - Privacy policy
   - License information

4. **Review:**
   - Automated review (minutes)
   - Manual review for listed add-ons (days)
   - Signing happens automatically

### Edge Add-ons

Similar to Chrome Web Store:
- Visit [Microsoft Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge/overview)
- $20 registration fee for individual developers
- Similar submission process to Chrome

---

## Version Management

### Updating Version Number

Edit `manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "Smart Bookmark Organizer",
  "version": "3.1.0",    // <-- Update this
  "description": "..."
}
```

### Version Numbering Convention

Follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH
  3  . 0   . 0
```

- **MAJOR:** Breaking changes, major features
- **MINOR:** New features, backward compatible
- **PATCH:** Bug fixes, minor changes

**Examples:**
- `3.0.0` → `3.0.1` - Bug fix
- `3.0.1` → `3.1.0` - New feature
- `3.1.0` → `4.0.0` - Breaking change

### Update Checklist

Before releasing a new version:

1. ✅ Update `version` in `manifest.json`
2. ✅ Update `docs/CHANGELOG.md` with changes
3. ✅ Update version badge in `README.md`
4. ✅ Test all features thoroughly
5. ✅ Check for console errors
6. ✅ Validate manifest.json
7. ✅ Create git tag: `git tag v3.0.1`
8. ✅ Build extension package
9. ✅ Test installation from package
10. ✅ Submit to stores

### Manifest Validation

```bash
# Using web-ext (Firefox)
web-ext lint

# Manual validation
# Check at: https://manifest-validator.appspot.com/
```

---

## Quick Reference

### One-Command Packaging

**Chrome:**
```bash
# Build and test
cd Bookmark_organizer && chrome --pack-extension="$(pwd)"
```

**Firefox:**
```bash
# Build and test
cd Bookmark_organizer && web-ext build && web-ext run
```

**Universal ZIP:**
```bash
# Create clean archive
zip -r ../bookmark-organizer.zip . -x "*.git*" ".venv*" "*.md" "test.html" "*.pyc"
```

---

## Troubleshooting

### "Package is invalid: CRX_HEADER_INVALID"
- Don't manually edit .crx files
- Use Chrome's packer or repack from source

### "Package could not be installed: PACKAGE_ERROR_INVALID"
- Check manifest.json syntax
- Ensure all referenced files exist
- Verify icons are correct sizes

### "This extension is not listed in the Chrome Web Store"
- Load as unpacked in developer mode
- Or submit to Chrome Web Store

### Firefox: "Add-on could not be installed"
- Sign the extension at addons.mozilla.org
- Or disable signature verification (dev only)

---

## Security Best Practices

1. **Never commit `.pem` files** to version control
2. **Store private keys securely** (password manager, encrypted storage)
3. **Use same key for updates** to maintain extension ID
4. **Review permissions** before each release
5. **Scan for vulnerabilities** in dependencies
6. **Test in clean browser profile** before release
7. **Backup keys** in multiple secure locations

---

## Distribution Checklist

Before publishing:

- [ ] All features working
- [ ] No console errors
- [ ] Dark mode working
- [ ] All icons generated and optimized
- [ ] Manifest version updated
- [ ] Changelog updated
- [ ] README updated
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge (if applicable)
- [ ] Screenshots prepared (1280x800)
- [ ] Store description written
- [ ] Privacy policy prepared (if needed)
- [ ] Extension packed/built
- [ ] Test installation from package
- [ ] Git tagged with version
- [ ] Ready to submit!

---

## Resources

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
- [Edge Add-ons Dashboard](https://partner.microsoft.com/dashboard/microsoftedge/overview)
- [web-ext Documentation](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Extension Publishing Guide](https://developer.chrome.com/docs/webstore/publish/)

---

Created by **Mr.H1deZ** | Version 3.0.0
