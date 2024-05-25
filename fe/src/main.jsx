import {WebAppProvider} from '@altiore/twa';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {TonConnectUIProvider} from '@tonconnect/ui-react';

import App from './FluteForest.jsx';
import './scss/main.scss';
import {FixShowing} from './components/FixShowing.js';
import {DataProvider} from './store/DataProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <WebAppProvider options={{
            smoothButtonsTransition: false,
            smoothButtonsTransitionMs: 0,
        }}>
            <FixShowing>
                <DataProvider>
                    <TonConnectUIProvider manifestUrl={'https://mirosphere.github.io/big_boom/tonconnect-manifest.json'}>
                        <App/>
                    </TonConnectUIProvider>
                </DataProvider>
            </FixShowing>
        </WebAppProvider>
    </React.StrictMode>,
);
