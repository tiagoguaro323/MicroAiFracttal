import { produce } from 'immer';
import { IAction } from 'store/helpers/actions/actions';
import { MainTypes, IMain } from './actions';

const initialState: IMain = {
  toast: {
    icon: '',
    type: '',
    msg: '',
    preventDuplicate: false,
    persist: false,
    actionButton: true,
    subtitle: '',
    network: false,
    autoHideDuration: 5000,
  },
};

export default function mainReducer(
  // eslint-disable-next-line default-param-last
  state = initialState,
  action: IAction<any>,
) {
  return produce(state, (newState: any) => {
    switch (action.type) {
      case MainTypes.SUCCESS:
        newState.toast.type = 'success';
        newState.toast.msg = action.payload.msg;
        newState.toast.icon = action.payload.icon;
        newState.toast.preventDuplicate = action.payload.preventDuplicate;
        newState.toast.persist = action.payload.persist;
        newState.toast.autoHideDuration = 3000;
        break;
      case MainTypes.ERROR:
        newState.toast.type = 'error';
        newState.toast.msg = action.payload.msg;
        newState.toast.icon = action.payload.icon;
        newState.toast.preventDuplicate = action.payload.preventDuplicate;
        newState.toast.persist = action.payload.persist;
        newState.toast.actionButton = action.payload.actionButton;
        newState.toast.subtitle = action.payload.subtitle;
        newState.toast.network = action.payload.network;
        newState.toast.autoHideDuration = 5000;
        break;
      case MainTypes.INFO:
        newState.toast.type = 'info';
        newState.toast.msg = action.payload.msg;
        newState.toast.icon = action.payload.icon;
        newState.toast.preventDuplicate = action.payload.preventDuplicate;
        newState.toast.persist = action.payload.persist;
        newState.toast.actionButton = action.payload.actionButton;
        newState.toast.subtitle = action.payload.subtitle;
        newState.toast.network = action.payload.network;
        newState.toast.autoHideDuration = 5000;
        break;
      case MainTypes.CLEAR:
        newState.toast = {
          icon: '',
          type: '',
          msg: '',
          preventDuplicate: false,
          persist: false,
          actionButton: true,
          subtitle: '',
          network: false,
          autoHideDuration: 5000,
        };
        break;
    }
  });
}
