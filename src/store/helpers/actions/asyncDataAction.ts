import { Dispatch } from 'react';
import { push } from 'redux-first-history';
import objectPath from 'object-path';
import { mainError } from 'store/main/actions';
import i18n from 'i18n';
import { IModel } from 'core/helpers/ModelManager';
import { IData, DataManager } from 'core/helpers/DataManager';
import { reset } from 'store';
import CreateAction from './actions';

export interface IDataActionStatus {
  Path: string;
  ViewChange: string;
  Create: string;
  Read: string;
  Update: string;
  Delete: string;
  Loading: string;
  Success: string;
  Rollback: string;
  Error: string;
  Commit: string;
  Detail: string;
  Config: string;
  UpdateValidations: string;
}

export function DataActionStatus(type: string): IDataActionStatus {
  return {
    Path: `${type}`,
    ViewChange: `[${type}] View Change`,
    Create: `[${type}] Create`,
    Read: `[${type}] Read`,
    Update: `[${type}] Update`,
    Delete: `[${type}] Delete`,
    Loading: `[${type}] Loading`,
    Success: `[${type}] Success (SideEffect)`,
    Rollback: `[${type}] Rollback (SideEffect)`,
    Error: `[${type}] Error (SideEffect)`,
    Commit: `[${type}] Commit`,
    Detail: `[${type}] Details`,
    Config: `[${type}] Config`,
    UpdateValidations: `[${type}] UpdateValidations`,
  };
}

export function createDataList(TypesActionStatus: IDataActionStatus) {
  const startedAction = CreateAction<any>(TypesActionStatus.Loading);
  const successAction = CreateAction<{ total: number; data: IModel[] }>(
    TypesActionStatus.Success,
  );
  const failureAction = CreateAction<void>(TypesActionStatus.Rollback);

  return (params: any = {}, extraParameters: any = {}) => {
    return (dispatch: Dispatch<any>, getState: any) => {
      let store = objectPath.get(getState(), TypesActionStatus.Path);

      if (store.isSync) {
        dispatch(mainError({ msg: i18n.t('SYNCHRONIZING_DB') }));
        return;
      }

      dispatch(
        startedAction({
          params,
          extraParameters,
        }),
      );

      store = objectPath.get(getState(), TypesActionStatus.Path);

      DataManager.list(
        store,
        (result: any) => {
          dispatch(successAction(result));
        },
        (result: any) => {
          if (result.message === 'USER_NOT_LOGIN') {
            dispatch(reset());
            dispatch(push('/signin'));
          } else {
            dispatch(failureAction());
            dispatch(mainError({ msg: i18n.t(result.message) }));
          }
        },
      );
    };
  };
}

export function createDataCreate<M extends IModel>(
  TypesActionStatus: IDataActionStatus,
) {
  const createAction = CreateAction<M>(TypesActionStatus.Create);
  const syncAction = createDataSync(TypesActionStatus);

  return (model: M) => {
    return (dispatch: Dispatch<any>, getState: any) => {
      dispatch(createAction(model));

      const store = objectPath.get(getState(), TypesActionStatus.Path);

      if (store.autoSync) {
        dispatch(syncAction({}));
      }
    };
  };
}

export function createDataRead<M extends IModel>(
  TypesActionStatus: IDataActionStatus,
) {
  const startedAction = CreateAction<IData<M>>(TypesActionStatus.Loading);

  return (source: IData<M>) => {
    return (dispatch: Dispatch<any>) => {
      dispatch(startedAction(source));
    };
  };
}

export function createCommit<D>(type: string) {
  return CreateAction<D>(type);
}

export function createViewChange<D>(type: string) {
  return CreateAction<D>(type);
}

export function createDataUpdate<M extends IModel>(
  TypesActionStatus: IDataActionStatus,
) {
  const updateAction = CreateAction<M>(TypesActionStatus.Update);
  const syncAction = createDataSync(TypesActionStatus);

  return (model: M) => {
    return (dispatch: Dispatch<any>, getState: any) => {
      dispatch(updateAction(model));

      const store = objectPath.get(getState(), TypesActionStatus.Path);

      if (store.autoSync) {
        dispatch(syncAction({}));
      }
    };
  };
}

export function createDataUpdateValidations<M extends IModel>(
  TypesActionStatus: IDataActionStatus,
) {
  const updateValidationsAction = CreateAction<M>(
    TypesActionStatus.UpdateValidations,
  );
  const syncAction = createDataSync(TypesActionStatus);

  return (model: M) => {
    return (dispatch: Dispatch<any>, getState: any) => {
      dispatch(updateValidationsAction(model));

      const store = objectPath.get(getState(), TypesActionStatus.Path);

      if (store.autoSync) {
        dispatch(syncAction({}));
      }
    };
  };
}

export function createDataDrop<M extends IModel>(
  TypesActionStatus: IDataActionStatus,
) {
  const dropAction = CreateAction<M>(TypesActionStatus.Delete);
  const syncAction = createDataSync(TypesActionStatus);

  return (model: M) => {
    return (dispatch: Dispatch<any>, getState: any) => {
      dispatch(dropAction(model));

      const store = objectPath.get(getState(), TypesActionStatus.Path);

      if (store.autoSync) {
        dispatch(syncAction({}));
      }
    };
  };
}

export function createDataSync(TypesActionStatus: IDataActionStatus) {
  const startedAction = CreateAction<any>(TypesActionStatus.Loading);
  const successAction = CreateAction<any>(TypesActionStatus.Success);
  const errorAction = CreateAction<void>(TypesActionStatus.Error);

  return (extraParameters: any = {}) => {
    return (dispatch: Dispatch<any>, getState: any) => {
      let store = objectPath.get(getState(), TypesActionStatus.Path);

      if (store.isSync) {
        return;
      }

      dispatch(
        startedAction({
          extraParameters: { ...store.lastParameters, ...extraParameters },
          params: { sync: true },
        }),
      );

      store = objectPath.get(getState(), TypesActionStatus.Path);

      if (
        !DataManager.sync(
          store,
          (result: any) => {
            dispatch(successAction(result));
          },
          (result: any) => {
            dispatch(errorAction(result));
            dispatch(mainError({ msg: i18n.t(result.message) }));
            if (result.message === 'USER_NOT_LOGIN') {
              dispatch(reset());
              dispatch(push('/signin'));
            }
          },
        )
      ) {
        dispatch(successAction({}));
      }
    };
  };
}

export function createConfigChange<D>(type: string) {
  return CreateAction<D>(type);
}
