import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/app';
import { ThemeProvider, CssBaseline, StyledEngineProvider } from '@mui/material';
import { GlobalStyles } from '@mui/system';
import './styles/theme.css'
import { muiTheme } from './styles/muitheme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst enableCssLayer>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
)
