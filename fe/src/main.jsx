import { WebAppProvider } from '@altiore/twa';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './FluteForest.jsx';
import './scss/main.scss';
import { FixShowing } from './components/FixShowing.js';
import { DataProvider } from './store/DataProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WebAppProvider options={{
      smoothButtonsTransition: false,
      smoothButtonsTransitionMs: 0,
    }}>
      <FixShowing>
        <DataProvider>
          <App />
        </DataProvider>
      </FixShowing>
    </WebAppProvider>
  </React.StrictMode>,
);
