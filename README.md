# MUI Autocomplete Multi-Select Study

Interactive playground comparing 7 variations of MUI's Autocomplete component configured for multi-select with fixed-height inputs.

## What's in here

Each variant builds on the last, exploring different UX behaviors:

1. **Default MUI** -- Standard multi-select (grows vertically as you add items)
2. **Fixed height, count summary** -- Stays at 56px, shows "N locations selected"
3. **First item + count** -- Shows first selected item name + "+N more"
4. **2 chips + count** -- Shows 2 real MUI Chips + "+N more"
5. **Auto-highlight + Select All** -- Type to filter, hit Enter to select highlighted option. Includes a Select All toggle with indeterminate state.
6. **Backspace clears all** -- All options selected by default. Backspace clears entire selection at once. Individual items can still be toggled via the dropdown.
7. **Hide Select All while typing** -- Same as #6, but the Select All option hides when the user is actively filtering (unless they're typing "select all").

A placeholder box below the grid simulates a data table to demonstrate that fixed-height variants don't push page content around.

## Running locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Tech

- React 19
- MUI v7 (Material UI)
- Vite 7
- TypeScript
