import { useState, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';

// Simulated location data
const locations = [
  { label: 'Tulsa, OK' },
  { label: 'Oklahoma City, OK' },
  { label: 'Dallas, TX' },
  { label: 'Houston, TX' },
  { label: 'Kansas City, MO' },
  { label: 'Denver, CO' },
  { label: 'Omaha, NE' },
  { label: 'Wichita, KS' },
  { label: 'Little Rock, AR' },
  { label: 'Memphis, TN' },
  { label: 'San Antonio, TX' },
  { label: 'Austin, TX' },
  { label: 'Amarillo, TX' },
  { label: 'Lubbock, TX' },
  { label: 'El Paso, TX' },
  { label: 'Springfield, MO' },
  { label: 'Joplin, MO' },
  { label: 'Fayetteville, AR' },
  { label: 'Fort Smith, AR' },
  { label: 'Bartlesville, OK' },
];

// ---- Default MUI behavior (grows vertically) ----
function DefaultAutocomplete() {
  return (
    <Autocomplete
      multiple
      limitTags={2}
      options={locations}
      getOptionLabel={(option) => option.label}
      defaultValue={[locations[0], locations[1], locations[2]]}
      disableCloseOnSelect
      renderInput={(params) => (
        <TextField {...params} label="Default (grows)" placeholder="Locations" />
      )}
      sx={{ width: 400 }}
    />
  );
}

// ---- Fixed height: no growth, checkbox-only feedback ----
function FixedHeightAutocomplete() {
  const [selected, setSelected] = useState<typeof locations>([
    locations[0],
    locations[1],
    locations[2],
  ]);

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={locations}
      value={selected}
      onChange={(_event, newValue) => setSelected(newValue)}
      getOptionLabel={(option) => option.label}
      // Replace chips with a single-line summary
      renderTags={(value) =>
        value.length > 0 ? (
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 'calc(100% - 70px)',
              display: 'inline-block',
              fontSize: '0.875rem',
              lineHeight: '40px',
              paddingLeft: 4,
            }}
          >
            {value.length === 1
              ? value[0].label
              : `${value.length} locations selected`}
          </span>
        ) : null
      }
      renderOption={(props, option, { selected }) => {
        const { key, ...rest } = props;
        return (
          <li key={key} {...rest}>
            <Checkbox
              size="small"
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Fixed height (no growth)"
          placeholder={selected.length === 0 ? 'Select locations...' : ''}
        />
      )}
      sx={{
        width: 400,
        '& .MuiInputBase-root': {
          flexWrap: 'nowrap',
          height: 56, // standard MUI outlined height
          overflow: 'hidden',
        },
      }}
    />
  );
}

// ---- Variation: first item + count ----
function FirstPlusCountAutocomplete() {
  const [selected, setSelected] = useState<typeof locations>([
    locations[0],
    locations[1],
    locations[2],
  ]);

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={locations}
      value={selected}
      onChange={(_event, newValue) => setSelected(newValue)}
      getOptionLabel={(option) => option.label}
      renderTags={(value) =>
        value.length > 0 ? (
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 'calc(100% - 70px)',
              display: 'inline-block',
              fontSize: '0.875rem',
              lineHeight: '40px',
              paddingLeft: 4,
            }}
          >
            {value[0].label}
            {value.length > 1 && (
              <span style={{ color: '#666', marginLeft: 4 }}>
                +{value.length - 1} more
              </span>
            )}
          </span>
        ) : null
      }
      renderOption={(props, option, { selected }) => {
        const { key, ...rest } = props;
        return (
          <li key={key} {...rest}>
            <Checkbox
              size="small"
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="First + count"
          placeholder={selected.length === 0 ? 'Select locations...' : ''}
        />
      )}
      sx={{
        width: 400,
        '& .MuiInputBase-root': {
          flexWrap: 'nowrap',
          height: 56,
          overflow: 'hidden',
        },
      }}
    />
  );
}

// ---- Variation: 2 real chips + count ----
function ChipsPlusCountAutocomplete() {
  const [selected, setSelected] = useState<typeof locations>([
    locations[0],
    locations[1],
    locations[2],
  ]);

  const MAX_CHIPS = 2;

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={locations}
      value={selected}
      onChange={(_event, newValue) => setSelected(newValue)}
      getOptionLabel={(option) => option.label}
      renderTags={(value, getTagProps) => {
        const visible = value.slice(0, MAX_CHIPS);
        const hiddenCount = value.length - MAX_CHIPS;
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              overflow: 'hidden',
              flexWrap: 'nowrap',
              maxWidth: 'calc(100% - 60px)',
            }}
          >
            {visible.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={option.label}
                  size="small"
                  {...tagProps}
                  sx={{
                    maxWidth: 120,
                    flexShrink: 0,
                  }}
                />
              );
            })}
            {hiddenCount > 0 && (
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                +{hiddenCount} more
              </Typography>
            )}
          </Box>
        );
      }}
      renderOption={(props, option, { selected }) => {
        const { key, ...rest } = props;
        return (
          <li key={key} {...rest}>
            <Checkbox
              size="small"
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Chips + count"
          placeholder={selected.length === 0 ? 'Select locations...' : ''}
        />
      )}
      sx={{
        width: 400,
        '& .MuiInputBase-root': {
          flexWrap: 'nowrap',
          height: 56,
          overflow: 'hidden',
        },
      }}
    />
  );
}

// ---- Variation: option 3 style + autoHighlight + Select All ----
const SELECT_ALL = { label: 'Select All' } as const;

function AutoHighlightAutocomplete() {
  const [selected, setSelected] = useState<typeof locations>([
    locations[0],
    locations[1],
    locations[2],
  ]);

  const allSelected = selected.length === locations.length;

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: (typeof locations[number])[],
  ) => {
    // Check if "Select All" was just clicked
    const hasSelectAll = newValue.some((v) => v === SELECT_ALL);
    if (hasSelectAll) {
      // Toggle: if all selected, clear; otherwise select all
      setSelected(allSelected ? [] : [...locations]);
    } else {
      setSelected(newValue);
    }
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      autoHighlight
      options={[SELECT_ALL, ...locations]}
      value={selected}
      onChange={handleChange}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      // Don't filter out "Select All" when typing
      filterOptions={(options, state) => {
        const filtered = options.filter(
          (o) =>
            o === SELECT_ALL ||
            o.label.toLowerCase().includes(state.inputValue.toLowerCase()),
        );
        return filtered;
      }}
      renderTags={(value) =>
        value.length > 0 ? (
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 'calc(100% - 70px)',
              display: 'inline-block',
              fontSize: '0.875rem',
              lineHeight: '40px',
              paddingLeft: 4,
            }}
          >
            {allSelected ? (
              'All locations'
            ) : (
              <>
                {value[0].label}
                {value.length > 1 && (
                  <span style={{ color: '#666', marginLeft: 4 }}>
                    +{value.length - 1} more
                  </span>
                )}
              </>
            )}
          </span>
        ) : null
      }
      renderOption={(props, option, { selected: isSelected }) => {
        const { key, ...rest } = props;
        const isSelectAll = option === SELECT_ALL;
        return (
          <li
            key={key}
            {...rest}
            style={{
              ...rest.style,
              ...(isSelectAll
                ? { borderBottom: '1px solid #e0e0e0', fontWeight: 600 }
                : {}),
            }}
          >
            <Checkbox
              size="small"
              style={{ marginRight: 8 }}
              checked={isSelectAll ? allSelected : isSelected}
              indeterminate={isSelectAll && selected.length > 0 && !allSelected}
            />
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Auto-highlight + first + count"
          placeholder={selected.length === 0 ? 'Select locations...' : ''}
        />
      )}
      sx={{
        width: 400,
        '& .MuiInputBase-root': {
          flexWrap: 'nowrap',
          height: 56,
          overflow: 'hidden',
        },
      }}
    />
  );
}

// ---- Variation: #5 + backspace clears all ----
function BackspaceClearsAllAutocomplete() {
  const [selected, setSelected] = useState<typeof locations>([...locations]);
  const inputRef = useRef<HTMLInputElement>(null);
  const backspacePressed = useRef(false);

  const allSelected = selected.length === locations.length;

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: (typeof locations[number])[],
    reason: string,
  ) => {
    if (reason === 'removeOption' && backspacePressed.current) {
      // Only clear all when backspace was pressed, not when clicking an option
      setSelected([]);
      backspacePressed.current = false;
      return;
    }
    const hasSelectAll = newValue.some((v) => v === SELECT_ALL);
    if (hasSelectAll) {
      setSelected(allSelected ? [] : [...locations]);
    } else {
      setSelected(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      backspacePressed.current = true;
    } else {
      backspacePressed.current = false;
    }
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      autoHighlight
      options={[SELECT_ALL, ...locations]}
      value={selected}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      filterOptions={(options, state) => {
        const filtered = options.filter(
          (o) =>
            o === SELECT_ALL ||
            o.label.toLowerCase().includes(state.inputValue.toLowerCase()),
        );
        return filtered;
      }}
      renderTags={(value) =>
        value.length > 0 ? (
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 'calc(100% - 70px)',
              display: 'inline-block',
              fontSize: '0.875rem',
              lineHeight: '40px',
              paddingLeft: 4,
            }}
          >
            {allSelected ? (
              'All locations'
            ) : (
              <>
                {value[0].label}
                {value.length > 1 && (
                  <span style={{ color: '#666', marginLeft: 4 }}>
                    +{value.length - 1} more
                  </span>
                )}
              </>
            )}
          </span>
        ) : null
      }
      renderOption={(props, option, { selected: isSelected }) => {
        const { key, ...rest } = props;
        const isSelectAll = option === SELECT_ALL;
        return (
          <li
            key={key}
            {...rest}
            style={{
              ...rest.style,
              ...(isSelectAll
                ? { borderBottom: '1px solid #e0e0e0', fontWeight: 600 }
                : {}),
            }}
          >
            <Checkbox
              size="small"
              style={{ marginRight: 8 }}
              checked={isSelectAll ? allSelected : isSelected}
              indeterminate={isSelectAll && selected.length > 0 && !allSelected}
            />
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          label="Backspace clears all"
          placeholder={selected.length === 0 ? 'Select locations...' : ''}
        />
      )}
      sx={{
        width: 400,
        '& .MuiInputBase-root': {
          flexWrap: 'nowrap',
          height: 56,
          overflow: 'hidden',
        },
      }}
    />
  );
}

// ---- Variation: #6 + hide Select All while typing (unless typing "select all") ----
function HideSelectAllWhileTypingAutocomplete() {
  const [selected, setSelected] = useState<typeof locations>([...locations]);
  const inputRef = useRef<HTMLInputElement>(null);
  const backspacePressed = useRef(false);

  const allSelected = selected.length === locations.length;

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: (typeof locations[number])[],
    reason: string,
  ) => {
    if (reason === 'removeOption' && backspacePressed.current) {
      // Only clear all when backspace was pressed, not when clicking an option
      setSelected([]);
      backspacePressed.current = false;
      return;
    }
    const hasSelectAll = newValue.some((v) => v === SELECT_ALL);
    if (hasSelectAll) {
      setSelected(allSelected ? [] : [...locations]);
    } else {
      setSelected(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      backspacePressed.current = true;
    } else {
      backspacePressed.current = false;
    }
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      autoHighlight
      options={[SELECT_ALL, ...locations]}
      value={selected}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      filterOptions={(options, state) => {
        const input = state.inputValue.toLowerCase();
        return options.filter((o) => {
          if (o === SELECT_ALL) {
            // Show Select All only when input is empty or matches "select all"
            return input === '' || 'select all'.startsWith(input);
          }
          return o.label.toLowerCase().includes(input);
        });
      }}
      renderTags={(value) =>
        value.length > 0 ? (
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 'calc(100% - 70px)',
              display: 'inline-block',
              fontSize: '0.875rem',
              lineHeight: '40px',
              paddingLeft: 4,
            }}
          >
            {allSelected ? (
              'All locations'
            ) : (
              <>
                {value[0].label}
                {value.length > 1 && (
                  <span style={{ color: '#666', marginLeft: 4 }}>
                    +{value.length - 1} more
                  </span>
                )}
              </>
            )}
          </span>
        ) : null
      }
      renderOption={(props, option, { selected: isSelected }) => {
        const { key, ...rest } = props;
        const isSelectAll = option === SELECT_ALL;
        return (
          <li
            key={key}
            {...rest}
            style={{
              ...rest.style,
              ...(isSelectAll
                ? { borderBottom: '1px solid #e0e0e0', fontWeight: 600 }
                : {}),
            }}
          >
            <Checkbox
              size="small"
              style={{ marginRight: 8 }}
              checked={isSelectAll ? allSelected : isSelected}
              indeterminate={isSelectAll && selected.length > 0 && !allSelected}
            />
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          label="Hide Select All while typing"
          placeholder={selected.length === 0 ? 'Select locations...' : ''}
        />
      )}
      sx={{
        width: 400,
        '& .MuiInputBase-root': {
          flexWrap: 'nowrap',
          height: 56,
          overflow: 'hidden',
        },
      }}
    />
  );
}

// ---- Code snippets and customization details for each variant ----

type CustomizationItem = {
  label: string;
  description: string;
  type: 'prop' | 'custom';
};

const variantDetails: Record<number, { title: string; code: string; customizations: CustomizationItem[] }> = {
  1: {
    title: '1. Default MUI (grows vertically)',
    code: `<Autocomplete
  multiple
  limitTags={2}
  options={locations}
  getOptionLabel={(option) => option.label}
  defaultValue={[locations[0], locations[1], locations[2]]}
  disableCloseOnSelect
  renderInput={(params) => (
    <TextField {...params} label="Default (grows)" placeholder="Locations" />
  )}
  sx={{ width: 400 }}
/>`,
    customizations: [
      { label: 'None', description: 'this is stock MUI Autocomplete with multiple + limitTags', type: 'prop' },
    ],
  },
  2: {
    title: '2. Fixed height — count summary',
    code: `<Autocomplete
  multiple
  disableCloseOnSelect
  options={locations}
  value={selected}
  onChange={(_event, newValue) => setSelected(newValue)}
  getOptionLabel={(option) => option.label}
  renderTags={(value) =>
    value.length > 0 ? (
      <span style={{ /* single-line truncated */ }}>
        {value.length === 1
          ? value[0].label
          : \`\${value.length} locations selected\`}
      </span>
    ) : null
  }
  renderOption={(props, option, { selected }) => (
    <li key={key} {...rest}>
      <Checkbox size="small" checked={selected} />
      {option.label}
    </li>
  )}
  renderInput={(params) => (
    <TextField {...params} label="Fixed height (no growth)" />
  )}
  sx={{
    width: 400,
    '& .MuiInputBase-root': {
      flexWrap: 'nowrap',
      height: 56,
      overflow: 'hidden',
    },
  }}
/>`,
    customizations: [
      { label: 'renderTags', description: 'replaces default chips with a single-line text summary ("3 locations selected")', type: 'custom' },
      { label: 'sx .MuiInputBase-root', description: 'forces flexWrap: nowrap, fixed height: 56, overflow: hidden to prevent vertical growth', type: 'custom' },
      { label: 'renderOption', description: 'adds Checkbox to each option for visual selection feedback', type: 'prop' },
    ],
  },
  3: {
    title: '3. Fixed height — first item text + count',
    code: `<Autocomplete
  multiple
  disableCloseOnSelect
  options={locations}
  value={selected}
  onChange={(_event, newValue) => setSelected(newValue)}
  getOptionLabel={(option) => option.label}
  renderTags={(value) =>
    value.length > 0 ? (
      <span style={{ /* single-line truncated */ }}>
        {value[0].label}
        {value.length > 1 && (
          <span style={{ color: '#666' }}>+{value.length - 1} more</span>
        )}
      </span>
    ) : null
  }
  renderOption={/* same checkbox pattern */}
  renderInput={(params) => (
    <TextField {...params} label="First + count" />
  )}
  sx={{
    width: 400,
    '& .MuiInputBase-root': {
      flexWrap: 'nowrap', height: 56, overflow: 'hidden',
    },
  }}
/>`,
    customizations: [
      { label: 'renderTags', description: 'shows first selected item label + "+N more" count instead of chips', type: 'custom' },
      { label: 'sx .MuiInputBase-root', description: 'same fixed-height lockdown as #2', type: 'custom' },
      { label: 'renderOption', description: 'same checkbox pattern as #2', type: 'prop' },
    ],
  },
  4: {
    title: '4. Fixed height — 2 chips + count',
    code: `const MAX_CHIPS = 2;

<Autocomplete
  multiple
  disableCloseOnSelect
  options={locations}
  value={selected}
  onChange={(_event, newValue) => setSelected(newValue)}
  getOptionLabel={(option) => option.label}
  renderTags={(value, getTagProps) => {
    const visible = value.slice(0, MAX_CHIPS);
    const hiddenCount = value.length - MAX_CHIPS;
    return (
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', overflow: 'hidden' }}>
        {visible.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip key={key} label={option.label} size="small" {...tagProps}
              sx={{ maxWidth: 120, flexShrink: 0 }} />
          );
        })}
        {hiddenCount > 0 && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            +{hiddenCount} more
          </Typography>
        )}
      </Box>
    );
  }}
  renderOption={/* same checkbox pattern */}
  renderInput={(params) => (
    <TextField {...params} label="Chips + count" />
  )}
  sx={{
    width: 400,
    '& .MuiInputBase-root': {
      flexWrap: 'nowrap', height: 56, overflow: 'hidden',
    },
  }}
/>`,
    customizations: [
      { label: 'renderTags', description: 'shows first 2 real Chip components (deletable) + "+N more" text overflow', type: 'custom' },
      { label: 'Chip sx maxWidth: 120', description: 'prevents long labels from blowing out the container', type: 'custom' },
      { label: 'getTagProps', description: 'proper chip delete behavior (MUI wiring)', type: 'prop' },
      { label: 'sx .MuiInputBase-root', description: 'same fixed-height lockdown', type: 'custom' },
    ],
  },
  5: {
    title: '5. #3 + autoHighlight + Select All',
    code: `const SELECT_ALL = { label: 'Select All' };

const handleChange = (_event, newValue) => {
  const hasSelectAll = newValue.some((v) => v === SELECT_ALL);
  if (hasSelectAll) {
    setSelected(allSelected ? [] : [...locations]);
  } else {
    setSelected(newValue);
  }
};

<Autocomplete
  multiple
  disableCloseOnSelect
  autoHighlight
  options={[SELECT_ALL, ...locations]}
  value={selected}
  onChange={handleChange}
  getOptionLabel={(option) => option.label}
  isOptionEqualToValue={(option, value) => option.label === value.label}
  filterOptions={(options, state) => {
    return options.filter((o) =>
      o === SELECT_ALL ||
      o.label.toLowerCase().includes(state.inputValue.toLowerCase()),
    );
  }}
  renderTags={(value) => /* "All locations" or "First +N more" */}
  renderOption={(props, option, { selected }) => (
    <li key={key} {...rest}
      style={isSelectAll ? { borderBottom: '1px solid #e0e0e0', fontWeight: 600 } : {}}>
      <Checkbox size="small" checked={isSelectAll ? allSelected : selected}
        indeterminate={isSelectAll && selected.length > 0 && !allSelected} />
      {option.label}
    </li>
  )}
  renderInput={(params) => (
    <TextField {...params} label="Auto-highlight + first + count" />
  )}
  sx={/* same fixed-height */}
/>`,
    customizations: [
      { label: 'autoHighlight', description: 'first filtered option auto-highlights so Enter selects it immediately', type: 'prop' },
      { label: 'SELECT_ALL synthetic option', description: 'prepended to options array, not a real data item', type: 'custom' },
      { label: 'handleChange', description: 'intercepts Select All clicks to toggle all locations on/off', type: 'custom' },
      { label: 'filterOptions', description: 'keeps Select All visible regardless of search input', type: 'custom' },
      { label: 'isOptionEqualToValue', description: 'compares by label to avoid reference equality issues with Select All', type: 'prop' },
      { label: 'renderOption', description: 'Select All gets a bottom border, bold text, and indeterminate checkbox state', type: 'custom' },
      { label: 'renderTags', description: 'shows "All locations" when everything is selected', type: 'custom' },
    ],
  },
  6: {
    title: '6. #5 + backspace clears all',
    code: `const backspacePressed = useRef(false);

const handleChange = (_event, newValue, reason) => {
  if (reason === 'removeOption' && backspacePressed.current) {
    setSelected([]);
    backspacePressed.current = false;
    return;
  }
  // ...Select All logic same as #5
};

const handleKeyDown = (e) => {
  if (e.key === 'Backspace') {
    backspacePressed.current = true;
  } else {
    backspacePressed.current = false;
  }
};

<Autocomplete
  multiple
  disableCloseOnSelect
  autoHighlight
  options={[SELECT_ALL, ...locations]}
  value={selected}
  onChange={handleChange}
  onKeyDown={handleKeyDown}
  /* ...rest same as #5 */
/>`,
    customizations: [
      { label: 'backspacePressed ref', description: 'tracks whether backspace was the key that triggered removeOption', type: 'custom' },
      { label: 'onChange reason check', description: 'distinguishes backspace removal from click removal (both fire "removeOption")', type: 'custom' },
      { label: 'handleKeyDown', description: 'backspace clears ALL selections instead of removing one-by-one', type: 'custom' },
      { label: 'Default state', description: 'all locations selected (inverted selection model)', type: 'custom' },
      { label: 'autoHighlight', description: 'first filtered option auto-highlights so Enter selects it immediately', type: 'prop' },
      { label: 'SELECT_ALL synthetic option', description: 'prepended to options array, not a real data item', type: 'custom' },
      { label: 'handleChange', description: 'intercepts Select All clicks to toggle all locations on/off', type: 'custom' },
      { label: 'filterOptions', description: 'keeps Select All visible regardless of search input', type: 'custom' },
      { label: 'isOptionEqualToValue', description: 'compares by label to avoid reference equality issues with Select All', type: 'prop' },
      { label: 'renderOption', description: 'Select All gets a bottom border, bold text, and indeterminate checkbox state', type: 'custom' },
      { label: 'renderTags', description: 'shows "All locations" when everything is selected, otherwise first + count', type: 'custom' },
      { label: 'sx .MuiInputBase-root', description: 'forces flexWrap: nowrap, fixed height: 56, overflow: hidden', type: 'custom' },
    ],
  },
  7: {
    title: '7. #6 + hide Select All while typing',
    code: `filterOptions={(options, state) => {
  const input = state.inputValue.toLowerCase();
  return options.filter((o) => {
    if (o === SELECT_ALL) {
      // Show Select All only when input is empty
      // or user is literally typing "select all"
      return input === '' || 'select all'.startsWith(input);
    }
    return o.label.toLowerCase().includes(input);
  });
}}

// Everything else same as #6`,
    customizations: [
      { label: 'filterOptions', description: 'hides Select All when user is typing a search query; reappears when input is empty or matches "select all"', type: 'custom' },
      { label: 'backspacePressed ref', description: 'tracks whether backspace was the key that triggered removeOption', type: 'custom' },
      { label: 'onChange reason check', description: 'distinguishes backspace removal from click removal (both fire "removeOption")', type: 'custom' },
      { label: 'handleKeyDown', description: 'backspace clears ALL selections instead of removing one-by-one', type: 'custom' },
      { label: 'Default state', description: 'all locations selected (inverted selection model)', type: 'custom' },
      { label: 'autoHighlight', description: 'first filtered option auto-highlights so Enter selects it immediately', type: 'prop' },
      { label: 'SELECT_ALL synthetic option', description: 'prepended to options array, not a real data item', type: 'custom' },
      { label: 'handleChange', description: 'intercepts Select All clicks to toggle all locations on/off', type: 'custom' },
      { label: 'isOptionEqualToValue', description: 'compares by label to avoid reference equality issues with Select All', type: 'prop' },
      { label: 'renderOption', description: 'Select All gets a bottom border, bold text, and indeterminate checkbox state', type: 'custom' },
      { label: 'renderTags', description: 'shows "All locations" when everything is selected, otherwise first + count', type: 'custom' },
      { label: 'sx .MuiInputBase-root', description: 'forces flexWrap: nowrap, fixed height: 56, overflow: hidden', type: 'custom' },
    ],
  },
};

// ---- Page layout: all seven for comparison ----
export default function FixedHeightMultiSelect() {
  const [selectedVariant, setSelectedVariant] = useState(1);

  const detail = variantDetails[selectedVariant];

  return (
    <Box sx={{ p: 4, maxWidth: 1400 }}>
      <Typography variant="h5" gutterBottom>
        Autocomplete Multi-Select: Fixed Height Demo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Select 5+ items in each to compare the behavior. The default grows; the
        others stay fixed. Click the radio button to view code and customizations below.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 4,
          alignItems: 'start',
        }}
      >
        {/* 1: Default behavior */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            p: 1.5,
            borderRadius: 1,
            border: selectedVariant === 1 ? '2px solid' : '2px solid transparent',
            borderColor: selectedVariant === 1 ? 'primary.main' : 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedVariant(1)}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              1. Default MUI (grows vertically)
            </Typography>
            <DefaultAutocomplete />
          </Box>
          <Radio
            checked={selectedVariant === 1}
            onChange={() => setSelectedVariant(1)}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Box>

        {/* 2: Fixed height, count summary */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            p: 1.5,
            borderRadius: 1,
            border: selectedVariant === 2 ? '2px solid' : '2px solid transparent',
            borderColor: selectedVariant === 2 ? 'primary.main' : 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedVariant(2)}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              2. Fixed height — count summary
            </Typography>
            <FixedHeightAutocomplete />
          </Box>
          <Radio
            checked={selectedVariant === 2}
            onChange={() => setSelectedVariant(2)}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Box>

        {/* 3: Fixed height, first text + count */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            p: 1.5,
            borderRadius: 1,
            border: selectedVariant === 3 ? '2px solid' : '2px solid transparent',
            borderColor: selectedVariant === 3 ? 'primary.main' : 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedVariant(3)}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              3. Fixed height — first item text + count
            </Typography>
            <FirstPlusCountAutocomplete />
          </Box>
          <Radio
            checked={selectedVariant === 3}
            onChange={() => setSelectedVariant(3)}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Box>

        {/* 4: Fixed height, 2 real chips + count */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            p: 1.5,
            borderRadius: 1,
            border: selectedVariant === 4 ? '2px solid' : '2px solid transparent',
            borderColor: selectedVariant === 4 ? 'primary.main' : 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedVariant(4)}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              4. Fixed height — 2 chips + count
            </Typography>
            <ChipsPlusCountAutocomplete />
          </Box>
          <Radio
            checked={selectedVariant === 4}
            onChange={() => setSelectedVariant(4)}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Box>

        {/* 5: Option 3 + autoHighlight */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            p: 1.5,
            borderRadius: 1,
            border: selectedVariant === 5 ? '2px solid' : '2px solid transparent',
            borderColor: selectedVariant === 5 ? 'primary.main' : 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedVariant(5)}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              5. #3 + autoHighlight (type & hit Enter)
            </Typography>
            <AutoHighlightAutocomplete />
          </Box>
          <Radio
            checked={selectedVariant === 5}
            onChange={() => setSelectedVariant(5)}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Box>

        {/* 6: #5 + backspace clears all, all selected by default */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            p: 1.5,
            borderRadius: 1,
            border: selectedVariant === 6 ? '2px solid' : '2px solid transparent',
            borderColor: selectedVariant === 6 ? 'primary.main' : 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedVariant(6)}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              6. #5 + backspace clears all (all selected)
            </Typography>
            <BackspaceClearsAllAutocomplete />
          </Box>
          <Radio
            checked={selectedVariant === 6}
            onChange={() => setSelectedVariant(6)}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Box>

        {/* 7: #6 + hide Select All while typing */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            p: 1.5,
            borderRadius: 1,
            border: selectedVariant === 7 ? '2px solid' : '2px solid transparent',
            borderColor: selectedVariant === 7 ? 'primary.main' : 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedVariant(7)}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              7. #6 + hide Select All while typing
            </Typography>
            <HideSelectAllWhileTypingAutocomplete />
          </Box>
          <Radio
            checked={selectedVariant === 7}
            onChange={() => setSelectedVariant(7)}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Box>

      {/* Code & Customization Panel */}
      <Box sx={{ mt: 4, display: 'flex', gap: 3, alignItems: 'stretch' }}>
        {/* Code Panel */}
        <Paper
          variant="outlined"
          sx={{
            flex: 2,
            p: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ px: 2, py: 1.5, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2">
              Code — {detail.title}
            </Typography>
          </Box>
          <Box
            component="pre"
            sx={{
              p: 2,
              m: 0,
              overflow: 'auto',
              maxHeight: 500,
              fontSize: '0.8rem',
              lineHeight: 1.5,
              fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
              bgcolor: '#1e1e1e',
              color: '#d4d4d4',
              '& code': { fontFamily: 'inherit' },
            }}
          >
            <code>{detail.code}</code>
          </Box>
        </Paper>

        {/* What's Custom Panel */}
        <Paper
          variant="outlined"
          sx={{
            flex: 1,
            p: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ px: 2, py: 1.5, bgcolor: 'primary.50', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="primary.main">
              What's Custom
            </Typography>
          </Box>
          <Box sx={{ p: 2, overflow: 'auto', maxHeight: 500 }}>
            {detail.customizations.map((item, i) => (
              <Box key={i} sx={{ mb: 1.5, display: 'flex', gap: 1 }}>
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: 'text.secondary', flexShrink: 0 }}
                >
                  {'\u2022'}
                </Typography>
                <Typography variant="body2">
                  <code style={{
                    backgroundColor: item.type === 'custom'
                      ? 'rgba(211, 47, 47, 0.08)'
                      : 'rgba(25, 118, 210, 0.08)',
                    color: item.type === 'custom' ? '#c62828' : '#1565c0',
                    padding: '1px 6px',
                    borderRadius: 3,
                    fontSize: '0.8rem',
                    fontFamily: '"Fira Code", monospace',
                  }}>
                    {item.label}
                  </code>
                  {' — '}{item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
