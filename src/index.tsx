/* eslint-disable import/order */
import '@capacitor/core';
import React from 'react';
import { Provider } from 'react-redux';
import store, { persistor, history } from 'store';
import { PersistGate } from 'redux-persist/integration/react';
import App from 'App';

// import App from 'App/Test';

// I18N Translation
import 'i18n';
import '@fontsource/heebo';
import '@fontsource/manrope';
import './index.css';
import { HistoryRouter } from 'redux-first-history/rr6';

import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HistoryRouter history={history}>
        <App />
      </HistoryRouter>
    </PersistGate>
  </Provider>,
);
