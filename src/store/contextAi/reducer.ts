// store/currentConversationID/reducer.ts
const SET_CONTEXT_AI = 'SET_CONTEXT_AI';

export interface State {
  model: string | null;
}

const initialState: State = {
  model: null,
};

export default function currentConversationIDReducer(
  state: State | undefined,
  action: { type: string; payload?: any },
): State {
  if (state === undefined) {
    state = initialState;
  }
  switch (action.type) {
    case SET_CONTEXT_AI:
      return { ...state, model: action.payload };
    default:
      return state;
  }
}

// Export the action type for reuse
export { SET_CONTEXT_AI };
