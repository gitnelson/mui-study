import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import FixedHeightMultiSelect from './FixedHeightMultiSelect';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FixedHeightMultiSelect />
    </ThemeProvider>
  );
}

export default App;
