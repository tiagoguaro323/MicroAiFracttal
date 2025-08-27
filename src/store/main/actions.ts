import CreateAction from 'store/helpers/actions/actions';

export enum MainTypes {
  SUCCESS = '[@@main.toast] Success',
  INFO = '[@@main.toast] Info',
  ERROR = '[@@main.toast] Error',
  CLEAR = '[@@main.toast] Clear',
}

export interface IToast {
  icon?: string;
  type?: string;
  msg: string;
  preventDuplicate?: boolean;
  persist?: boolean;
  actionButton?: boolean;
  subtitle?: string;
  network?: boolean;
  autoHideDuration?: number;
}

export interface IMain {
  toast: IToast;
}

export const mainSuccess = CreateAction<IToast>(MainTypes.SUCCESS);
export const mainError = CreateAction<IToast>(MainTypes.ERROR);
export const mainClear = CreateAction<void>(MainTypes.CLEAR);
export const mainInfo = CreateAction<IToast>(MainTypes.INFO);
