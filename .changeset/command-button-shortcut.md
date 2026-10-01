---
"@hilum/app-shell": patch
---

AppCommandButton shows the right shortcut for the device ("⌘K" on Apple devices, "Ctrl K" elsewhere; it always showed ⌘K). Its default accessible name now starts with the visible label ("Search (Ctrl+K)" rather than "Open command palette (Ctrl+K)"), so voice control users can say "click Search", and it declares `aria-keyshortcuts`.
