# Mindset Machine Launchers

This folder contains single-click launch utilities engineered by **Danger Labs**.

---

### Files

- **`launch.bat`**:
  - Automatically identifies and terminates any stale or lingering instances listening on port `5173`.
  - Clears transient cache (`node_modules/.vite`) for a guaranteed pristine startup.
  - Opens `http://localhost:5173` in your default browser.
  - Boots the development server with host access enabled.

### Usage

Double-click `launcher/launch.bat` directly from Windows Explorer, or execute from terminal:

```cmd
launcher\launch.bat
```
