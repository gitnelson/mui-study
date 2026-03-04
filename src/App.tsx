import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FixedHeightMultiSelect from './FixedHeightMultiSelect';
import AuthSequencingGrid from './AuthSequencingGrid';
import AuthSequenceMatrix from './AuthSequenceMatrix';
import AuthSequenceLanes from './AuthSequenceLanes';
import AuthSequenceSplitView from './AuthSequenceSplitView';
import AuthSequencingCardView from './AuthSequencingCardView';
import AuthSequencingHybrid from './AuthSequencingHybrid';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

type Page =
  | 'home'
  | 'multiselect'
  | 'auth-sequencing'
  | 'auth-matrix'
  | 'auth-lanes'
  | 'auth-split'
  | 'auth-cards'
  | 'auth-hybrid';

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'multiselect') return 'multiselect';
  if (hash === 'auth-sequencing') return 'auth-sequencing';
  if (hash === 'auth-matrix') return 'auth-matrix';
  if (hash === 'auth-lanes') return 'auth-lanes';
  if (hash === 'auth-split') return 'auth-split';
  if (hash === 'auth-cards') return 'auth-cards';
  if (hash === 'auth-hybrid') return 'auth-hybrid';
  return 'home';
}

function navigate(page: Page) {
  window.location.hash = page === 'home' ? '' : page;
}

const AUTH_PAGES: Page[] = ['auth-sequencing', 'auth-matrix', 'auth-lanes', 'auth-split', 'auth-cards'];

function NavBar({ current, collapsed, onToggle }: { current: Page; collapsed: boolean; onToggle: () => void }) {
  const isAuthPage = AUTH_PAGES.includes(current);

  if (collapsed) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          px: 3,
        }}
      >
        <IconButton size="small" onClick={onToggle} sx={{ py: 0.25 }}>
          <KeyboardArrowDownIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 3,
        py: 1.5,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexWrap: 'wrap',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, cursor: 'pointer', mr: 1 }}
        onClick={() => navigate('home')}
      >
        MUI Study
      </Typography>

      <Button
        size="small"
        variant={current === 'multiselect' ? 'contained' : 'text'}
        onClick={() => navigate('multiselect')}
      >
        MultiSelect
      </Button>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Auth Sequencing — Round 2 */}
      <Typography variant="caption" sx={{ color: 'text.disabled', mr: 0.5, fontWeight: 600 }}>
        R2:
      </Typography>
      <Button
        size="small"
        variant={current === 'auth-hybrid' ? 'contained' : isAuthPage ? 'outlined' : 'text'}
        onClick={() => navigate('auth-hybrid')}
        sx={{ fontSize: '0.75rem' }}
      >
        Hybrid
      </Button>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Auth Sequencing — Round 1 */}
      <Typography variant="caption" sx={{ color: 'text.disabled', mr: 0.5, fontWeight: 600 }}>
        R1:
      </Typography>
      <Button
        size="small"
        variant={current === 'auth-sequencing' ? 'contained' : isAuthPage ? 'outlined' : 'text'}
        onClick={() => navigate('auth-sequencing')}
        sx={{ fontSize: '0.75rem' }}
      >
        Table
      </Button>
      <Button
        size="small"
        variant={current === 'auth-matrix' ? 'contained' : isAuthPage ? 'outlined' : 'text'}
        onClick={() => navigate('auth-matrix')}
        sx={{ fontSize: '0.75rem' }}
      >
        Heat Map
      </Button>
      <Button
        size="small"
        variant={current === 'auth-lanes' ? 'contained' : isAuthPage ? 'outlined' : 'text'}
        onClick={() => navigate('auth-lanes')}
        sx={{ fontSize: '0.75rem' }}
      >
        Lanes
      </Button>
      <Button
        size="small"
        variant={current === 'auth-split' ? 'contained' : isAuthPage ? 'outlined' : 'text'}
        onClick={() => navigate('auth-split')}
        sx={{ fontSize: '0.75rem' }}
      >
        Split View
      </Button>
      <Button
        size="small"
        variant={current === 'auth-cards' ? 'contained' : isAuthPage ? 'outlined' : 'text'}
        onClick={() => navigate('auth-cards')}
        sx={{ fontSize: '0.75rem' }}
      >
        Cards
      </Button>

      <Box sx={{ ml: 'auto' }}>
        <IconButton size="small" onClick={onToggle}>
          <KeyboardArrowUpIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

type ConceptEntry = { page: Page; label: string };

const ROUND_1: ConceptEntry[] = [
  { page: 'auth-sequencing', label: 'Table' },
  { page: 'auth-matrix',    label: 'Heat Map' },
  { page: 'auth-lanes',     label: 'Lanes' },
  { page: 'auth-split',     label: 'Split View' },
  { page: 'auth-cards',     label: 'Cards (0.5)' },
];

const ROUND_2: ConceptEntry[] = [
  { page: 'auth-hybrid', label: 'Cards + Table (Hybrid)' },
];

const STUDIES: ConceptEntry[] = [
  { page: 'multiselect', label: 'Fixed Height MultiSelect' },
];

function ConceptList({ entries }: { entries: ConceptEntry[] }) {
  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.disabled" sx={{ py: 1, fontStyle: 'italic' }}>
        Nothing here yet.
      </Typography>
    );
  }
  return (
    <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {entries.map(({ page, label }) => (
        <Box
          component="li"
          key={page}
          onClick={() => navigate(page)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'text.disabled', flexShrink: 0 }} />
          <Typography variant="body2">{label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="overline"
        sx={{ color: 'text.disabled', letterSpacing: 1, display: 'block', mb: 0.5 }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {children}
    </Box>
  );
}

function HomePage() {
  return (
    <Box sx={{ p: 4, maxWidth: 560, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        MUI Study
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Auth sequencing prototypes + component studies.
      </Typography>

      <Section title="Auth Sequencing — Round 2">
        <ConceptList entries={ROUND_2} />
      </Section>

      <Section title="Auth Sequencing — Round 1">
        <ConceptList entries={ROUND_1} />
      </Section>

      <Section title="Component Studies">
        <ConceptList entries={STUDIES} />
      </Section>
    </Box>
  );
}

function App() {
  const [page, setPage] = useState<Page>(getPageFromHash);
  const [navCollapsed, setNavCollapsed] = useState(false);

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar current={page} collapsed={navCollapsed} onToggle={() => setNavCollapsed((c) => !c)} />
      {page === 'home' && <HomePage />}
      {page === 'multiselect' && <FixedHeightMultiSelect />}
      {page === 'auth-sequencing' && <AuthSequencingGrid />}
      {page === 'auth-matrix' && <AuthSequenceMatrix />}
      {page === 'auth-lanes' && <AuthSequenceLanes />}
      {page === 'auth-split' && <AuthSequenceSplitView />}
      {page === 'auth-cards' && <AuthSequencingCardView />}
      {page === 'auth-hybrid' && <AuthSequencingHybrid />}
    </ThemeProvider>
  );
}

export default App;
