/* eslint-disable @typescript-eslint/no-unused-vars */
import { combineReducers } from 'redux';
import mainReducer from './main/reducer';
import authReducer from './auth/reducer';
import themeToggleReducer from './theme/reducer';
import reducePersonnel from './personnel/reducer';
import currentConversationIDReducer from './conversation/reducer';
import contextAIReducer from './contextAi/reducer';

const createRootReducer = (routerReducer: any) =>
  combineReducers({
    router: routerReducer,
    theme: themeToggleReducer,
    auth: authReducer,
    main: mainReducer,
    contextAI: contextAIReducer,
    currentConversationID: currentConversationIDReducer,
    personnel: reducePersonnel,
  });

export default createRootReducer;
