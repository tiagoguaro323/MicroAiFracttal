import { IAction } from 'store/helpers/actions/actions';

export default function themeToggleReducer(
  // eslint-disable-next-line default-param-last
  state = 'light',
  action: IAction<any>,
) {
  if (action.type === 'Change Theme') {
    return action.payload;
  }
  return state;
}
