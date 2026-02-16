import { useState, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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

// ---- Page layout: all seven for comparison ----
export default function FixedHeightMultiSelect() {
  return (
    <Box sx={{ p: 4, maxWidth: 1400 }}>
      <Typography variant="h5" gutterBottom>
        Autocomplete Multi-Select: Fixed Height Demo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Select 5+ items in each to compare the behavior. The default grows; the
        others stay fixed.
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
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            1. Default MUI (grows vertically)
          </Typography>
          <DefaultAutocomplete />
        </Box>

        {/* 2: Fixed height, count summary */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            2. Fixed height — count summary
          </Typography>
          <FixedHeightAutocomplete />
        </Box>

        {/* 3: Fixed height, first text + count */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            3. Fixed height — first item text + count
          </Typography>
          <FirstPlusCountAutocomplete />
        </Box>

        {/* 4: Fixed height, 2 real chips + count */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            4. Fixed height — 2 chips + count
          </Typography>
          <ChipsPlusCountAutocomplete />
        </Box>

        {/* 5: Option 3 + autoHighlight */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            5. #3 + autoHighlight (type & hit Enter)
          </Typography>
          <AutoHighlightAutocomplete />
        </Box>

        {/* 6: #5 + backspace clears all, all selected by default */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            6. #5 + backspace clears all (all selected)
          </Typography>
          <BackspaceClearsAllAutocomplete />
        </Box>

        {/* 7: #6 + hide Select All while typing */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            7. #6 + hide Select All while typing
          </Typography>
          <HideSelectAllWhileTypingAutocomplete />
        </Box>
      </Box>

      {/* Simulated table below to show layout impact */}
      <Box
        sx={{
          mt: 4,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
          bgcolor: 'action.hover',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          ↑ This box represents your main table. Select many items in the
          default autocomplete above and watch this get pushed down. The fixed
          versions won't move it.
        </Typography>
      </Box>
    </Box>
  );
}
