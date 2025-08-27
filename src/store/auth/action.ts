import { Dispatch } from 'react';
import { push } from 'redux-first-history';
import { IModel } from 'core/helpers/ModelManager';
import {
  createModelUpdate,
  ModelActionStatus,
  createModelSave,
} from 'store/helpers/actions/asyncModelAction';
import JWT from 'core/services/JWT';

export const AuthTypesActions = ModelActionStatus('auth');

export const authSync = createModelSave<IModel>(
  AuthTypesActions,
  (dispatch: Dispatch<any>, result: any) => {
    JWT.setToken(result.data.token);
    dispatch(push('/'));
  },
);

export const authUpdate = createModelUpdate<IModel>(AuthTypesActions);
