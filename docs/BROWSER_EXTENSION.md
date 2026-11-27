# Mindset Machine — Browser Extension Guide

The **Mindset Machine Browser Companion** is a lightweight Manifest V3 extension for Chromium browsers (Chrome, Edge, Brave) and Firefox.

---

## 1. Features
- **Quick Focus Queue**: Inspect active tasks directly from the browser action popup.
- **Micro-Step Checklist**: Check off micro-tasks without switching away from your current web browser tab.
- **Context Menu Web Capture**: Highlight any text on the web $\rightarrow$ right click $\rightarrow$ select `"Add to Mindset Focus Stream"`.
- **Badge Counter**: Live visual badge displaying pending focus tasks.

---

## 2. Installation (Load Unpacked)

1. Build or download the extension package:
   - Direct Download: [`public/download/mindset-machine-extension.zip`](../public/download/mindset-machine-extension.zip)
   - Or build locally:
     ```bash
     python3 scripts/build-extension.py
     ```
2. Unzip the package into a local folder (e.g., `~/mindset-machine-extension`).
3. Open your browser extension manager:
   - Chrome / Brave: `chrome://extensions`
   - Edge: `edge://extensions`
4. Toggle **Developer Mode** in the top-right corner.
5. Click **Load unpacked** and select the unzipped `extension` directory.
6. Pin the Mindset Machine extension icon to your toolbar.

---

## 3. Directory Structure

```
extension/
├── manifest.json       # Manifest V3 specification
├── popup.html          # Zuari dark companion popup interface
├── popup.css           # Contrasting boxiness styling
├── popup.js            # Reactive task manager & storage controller
├── background.js       # Background service worker & context menu handler
└── icons/              # 16px, 48px, 128px extension icons
```
