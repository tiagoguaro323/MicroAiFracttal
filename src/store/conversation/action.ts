// store/currentConversationID/actions.ts
import { SET_CONVERSATION_ID } from './reducer';

const setCurrentConversationID = (id: string) => ({
  type: SET_CONVERSATION_ID,
  payload: id,
});

export default setCurrentConversationID;
