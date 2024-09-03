import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { createTheme, ThemeProvider, LocalizationProvider, CssBaseline } from '@cb-common/ui-react';
import App from './app/App';

const theme = createTheme();

ReactDOM.render(
  <StrictMode>
    <LocalizationProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </LocalizationProvider>
  </StrictMode>,
  document.getElementById('root')
);
