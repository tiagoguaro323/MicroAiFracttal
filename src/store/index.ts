/* eslint-disable import/order */
import { createBrowserHistory } from 'history';
import { createReduxHistoryContext } from 'redux-first-history';

import rpc from 'core/services/Backend';
import localForage from 'localforage';
import JWT from 'core/services/JWT';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import createRootReducer from './reducers';
import CreateAction from './helpers/actions/actions';

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory(),
  });

export const reset = CreateAction<void>('RESET');

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET') {
    JWT.logout();
    localForage.removeItem('persist:root');
    state = undefined;
  }
  return createRootReducer(routerReducer)(state, action);
};

const KEY = import.meta.env.VITE_KEY_ENCRYPT_REDUX;

// Store creation
const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: localForage,
    blacklist: ['router'], // navigation will not be persisted
    transforms: [
      encryptTransform({
        secretKey: KEY,
      }),
    ],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: rpc,
      },
    }).concat(routerMiddleware),
});

export const history = createReduxHistory(store);
export const persistor = persistStore(store);

export default store;
