import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App.jsx';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme='dark'>
      <Notifications position="bottom-right" zIndex={1000} />
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
