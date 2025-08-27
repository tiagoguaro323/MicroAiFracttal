// store/currentConversationID/actions.ts
import { SET_CONTEXT_AI } from './reducer';

const setCurrentContextAi = (model: any) => ({
  type: SET_CONTEXT_AI,
  payload: model,
});

export default setCurrentContextAi;
