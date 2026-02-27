import { useState, useEffect } from 'react';
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
  | 'auth-split';

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'multiselect') return 'multiselect';
  if (hash === 'auth-sequencing') return 'auth-sequencing';
  if (hash === 'auth-matrix') return 'auth-matrix';
  if (hash === 'auth-lanes') return 'auth-lanes';
  if (hash === 'auth-split') return 'auth-split';
  return 'home';
}

function navigate(page: Page) {
  window.location.hash = page === 'home' ? '' : page;
}

const AUTH_PAGES: Page[] = ['auth-sequencing', 'auth-matrix', 'auth-lanes', 'auth-split'];

function NavBar({ current, collapsed, onToggle }: { current: Page; collapsed: boolean; onToggle: () => void }) {
  const isAuthPage = AUTH_PAGES.includes(current);

  if (collapsed) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
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

      {/* Auth sequencing group */}
      <Typography variant="caption" sx={{ color: 'text.disabled', mr: 0.5, fontWeight: 600 }}>
        Auth Sequencing:
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

      <Box sx={{ ml: 'auto' }}>
        <IconButton size="small" onClick={onToggle}>
          <KeyboardArrowUpIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

const AUTH_CARDS: { page: Page; title: string; description: string }[] = [
  {
    page: 'auth-sequencing',
    title: 'Auth Sequencing — Table',
    description:
      'DataGrid Premium with 2-level row grouping (Location > Product), drag-and-drop sequence reordering, volume bars, and status indicators. The baseline approach.',
  },
  {
    page: 'auth-matrix',
    title: 'Auth Sequencing — Heat Map Matrix',
    description:
      'Spatial grid where each cell = one location × product combo. Color-coded by health. Click any cell to inspect the full sequence stack in an inline detail panel.',
  },
  {
    page: 'auth-lanes',
    title: 'Auth Sequencing — Lanes',
    description:
      'Swimlane columns — one lane per terminal. Numbered slots show who\'s 1st, 2nd, 3rd priority. Product selector per lane. Ghost slots normalize depth across terminals.',
  },
  {
    page: 'auth-split',
    title: 'Auth Sequencing — Split View',
    description:
      'Browse panel on the left, rich priority-stack visualization on the right. Supplier cards with numbered badges and connector lines suggest the "try in this order" workflow.',
  },
];

function HomePage() {
  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        MUI Component Prototypes
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Interactive prototypes exploring MUI patterns for our application.
      </Typography>

      <Box
        sx={{
          p: 3,
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          cursor: 'pointer',
          mb: 2,
          '&:hover': { bgcolor: 'action.hover' },
        }}
        onClick={() => navigate('multiselect')}
      >
        <Typography variant="h6">Fixed Height MultiSelect</Typography>
        <Typography variant="body2" color="text.secondary">
          Seven variants of MUI Autocomplete multi-select with fixed height containers,
          exploring chip display, count summaries, and Select All patterns.
        </Typography>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>
        Auth Sequencing — Four Approaches
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Exploring different UI paradigms for the same user need: "I just need to see
        everything without going into each one."
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {AUTH_CARDS.map(({ page, title, description }) => (
          <Box
            key={page}
            sx={{
              p: 3,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
            onClick={() => navigate(page)}
          >
            <Typography variant="h6" sx={{ fontSize: '1rem' }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          </Box>
        ))}
      </Box>
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
    </ThemeProvider>
  );
}

export default App;
