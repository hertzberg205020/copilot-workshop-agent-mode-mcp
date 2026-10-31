# Changelog

All notable changes to this to-do app are documented in this file.

## [0.2.0] - Step 2

### Added
- Dark mode toggle in the header, labelled "🌙 深色模式" in light theme and "☀️ 淺色模式" in dark theme.
- Theme preference saved to `localStorage` (`todo-list-theme`) and restored on reload.
- Falls back to the OS setting (`prefers-color-scheme`) when the user has never toggled manually, and follows OS changes live.
- All / Active / Completed filter buttons below the input, with a highlighted style on the selected one.
- Filter-specific empty-state messages when no items match the current filter.

### Changed
- Dark theme reuses the existing CSS variable mechanism; added `--color-input-bg` and `--color-chip-bg`, and the text input now uses a themed background.
- Header is now a flex row so the title and theme toggle share one line.
- The "未完成:N 項" counter is always calculated from all items and is unaffected by the active filter.

## [0.1.0] - Step 1

### Added
- Add to-do items via the input form (blank input is ignored).
- Mark items as completed / not completed with a checkbox.
- Delete items.
- Remaining-items counter ("未完成:N 項").
- Persistence of items in `localStorage` (`todo-list-items`).
- Empty-state hint when the list has no items.

### Changed
- None (initial release).
