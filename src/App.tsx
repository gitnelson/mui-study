import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FixedHeightMultiSelect from './FixedHeightMultiSelect';
import AuthSequencingGrid from './AuthSequencingGrid';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

type Page = 'home' | 'multiselect' | 'auth-sequencing';

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'multiselect') return 'multiselect';
  if (hash === 'auth-sequencing') return 'auth-sequencing';
  return 'home';
}

function navigate(page: Page) {
  window.location.hash = page === 'home' ? '' : page;
}

function NavBar({ current }: { current: Page }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 3,
        py: 1.5,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, cursor: 'pointer', mr: 2 }}
        onClick={() => navigate('home')}
      >
        MUI Study
      </Typography>
      <Button
        size="small"
        variant={current === 'multiselect' ? 'contained' : 'text'}
        onClick={() => navigate('multiselect')}
      >
        Fixed Height MultiSelect
      </Button>
      <Button
        size="small"
        variant={current === 'auth-sequencing' ? 'contained' : 'text'}
        onClick={() => navigate('auth-sequencing')}
      >
        Auth Sequencing Grid
      </Button>
    </Box>
  );
}

function HomePage() {
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        MUI Component Prototypes
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Interactive prototypes exploring MUI patterns for our application.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            p: 3,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            cursor: 'pointer',
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
        <Box
          sx={{
            p: 3,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
          onClick={() => navigate('auth-sequencing')}
        >
          <Typography variant="h6">Auth Sequencing Grid</Typography>
          <Typography variant="body2" color="text.secondary">
            DataGrid Premium prototype with row grouping, drag-and-drop reordering,
            volume bars, and status indicators for authorization sequencing.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  const [page, setPage] = useState<Page>(getPageFromHash);

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar current={page} />
      {page === 'home' && <HomePage />}
      {page === 'multiselect' && <FixedHeightMultiSelect />}
      {page === 'auth-sequencing' && <AuthSequencingGrid />}
    </ThemeProvider>
  );
}

export default App;
