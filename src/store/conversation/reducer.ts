// store/currentConversationID/reducer.ts
const SET_CONVERSATION_ID = 'SET_CONVERSATION_ID';

export interface State {
  id: string | null;
}

const initialState: State = {
  id: null,
};

export default function currentConversationIDReducer(
  state: State | undefined,
  action: { type: string; payload?: any },
): State {
  if (state === undefined) {
    state = initialState;
  }
  switch (action.type) {
    case SET_CONVERSATION_ID:
      return { ...state, id: action.payload };
    default:
      return state;
  }
}

// Export the action type for reuse
export { SET_CONVERSATION_ID };
