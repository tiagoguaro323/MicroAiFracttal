import { Dispatch } from 'react';
import { push } from 'redux-first-history';
import { IModel, ModelManager } from 'core/helpers/ModelManager';
import { mainError } from 'store/main/actions';
import { BackendService } from 'core/services/Backend';
import { IRpc } from 'core/services/RequestRpc';
import i18n from 'i18n';
import { reset } from 'store';
import CreateAction from './actions';

export interface IModelActionStatus {
  Create: string;
  Read: string;
  Update: string;
  Delete: string;
  Loading: string;
  Success: string;
  Failure: string;
}

export function ModelActionStatus(type: string): IModelActionStatus {
  return {
    Create: `[@@Model.${type}] Create`,
    Read: `[@@Model.${type}] Read`,
    Update: `[@@Model.${type}] Update`,
    Delete: `[@@Model.${type}] Delete`,
    Loading: `[@@Model.${type}] Loading`,
    Success: `[@@Model.${type}] Success (SideEffect)`,
    Failure: `[@@Model.${type}] Failure (SideEffect)`,
  };
}

export function createModelUpdate<M extends IModel>(
  TypesActionStatus: IModelActionStatus,
) {
  const updateAction = CreateAction<IModel>(TypesActionStatus.Update);
  const saveAction = createModelSave<M>(TypesActionStatus);

  return (model: M) => {
    return (dispatch: Dispatch<any>) => {
      dispatch(updateAction(model));

      if (model.autoSync) {
        dispatch(saveAction(model));
      }
    };
  };
}

export function createModelSave<M extends IModel>(
  TypesActionStatus: IModelActionStatus,
  onSave?: (dispatch: Dispatch<any>, result: any) => void,
) {
  const startedAction = CreateAction<void>(TypesActionStatus.Loading);
  const successAction = CreateAction<M>(TypesActionStatus.Success);
  const failureAction = CreateAction<void>(TypesActionStatus.Failure);

  return (model: M) => {
    return (dispatch: Dispatch<any>, getState: any, rpc: BackendService) => {
      dispatch(startedAction());

      rpc
        .invoke(
          (model.api && model.api.update) || '',
          ModelManager.getEditedData(model),
        )
        .then((res: IRpc) => {
          const { result } = res;
          if (result && result.success) {
            dispatch(successAction(result.data));
            onSave && onSave(dispatch, result);
          } else if (result) {
            if (result.message === 'USER_NOT_LOGIN') {
              dispatch(reset());
              dispatch(push('/signin'));
            } else {
              dispatch(failureAction());
              dispatch(mainError({ msg: i18n.t(result.message) }));
            }
          }
        });
    };
  };
}
