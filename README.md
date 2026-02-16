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

## How much is custom vs. base MUI? (Option 7 breakdown)

### Base MUI Autocomplete (zero custom code)

- `multiple` -- built-in multi-select mode
- `disableCloseOnSelect` -- built-in prop, keeps dropdown open after selection
- `autoHighlight` -- built-in prop, highlights first option automatically
- `options`, `value`, `onChange` -- standard controlled component pattern
- `getOptionLabel` -- standard prop
- `isOptionEqualToValue` -- standard prop for custom object comparison
- `renderInput` with `TextField` -- standard pattern
- The `sx` styling for fixed height (`flexWrap: 'nowrap'`, `height: 56`, `overflow: 'hidden'`) -- standard MUI `sx` props, though using them this way is a customization choice

### Light customization (using MUI's extension points as intended)

- `filterOptions` -- MUI provides this prop specifically for custom filtering logic. We're just adding conditional visibility for Select All. ~5 lines of custom logic.
- `renderTags` -- MUI provides this prop for custom tag rendering. We replaced chips with a text summary. ~15 lines of custom JSX.
- `renderOption` -- MUI provides this prop for custom option rendering. We added checkboxes and styled the Select All row. ~15 lines of custom JSX.
- `onChange` with `reason` parameter -- MUI passes `reason` as a third argument by design. We're using it to detect `removeOption`. Standard API surface.

### Truly custom (working around/beyond MUI)

- The `SELECT_ALL` synthetic option injected into the options array -- MUI has no built-in "select all." ~15 lines of handling logic.
- The `backspacePressed` ref + `onKeyDown` handler -- this is the only part where we're intercepting behavior MUI doesn't natively support. ~10 lines.

### Summary

Roughly 80% of option 7 is MUI's built-in API used as documented. The Select All toggle and the backspace-clears-all behavior are the two pieces of genuine custom logic, totaling about 25 lines. Everything else is MUI's Autocomplete doing what it was designed to do -- we're just choosing which extension points to use and how.

We're not fighting the framework -- we're using its intended customization surface.

## Tech

- React 19
- MUI v7 (Material UI)
- Vite 7
- TypeScript
