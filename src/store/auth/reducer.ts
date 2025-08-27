import { IModel, ModelManager } from 'core/helpers/ModelManager';
import reduceModelManager from 'store/helpers/reducers/asyncModelReducer';
import { AuthTypesActions } from './action';

const initialModel = ModelManager.init<IModel>({
  columns: [
    {
      field: 'email',
      critical: true,
    },
    {
      field: 'password',
      critical: true,
    },
    {
      field: 'company',
      type: 'object',
    },
    {
      field: 'account',
      type: 'object',
    },
    {
      field: 'permissions',
      type: 'object',
    },
    {
      field: 'menu',
      type: 'array',
    },
    {
      field: 'business_days',
      type: 'object',
    },
    {
      field: 'iso_code',
      type: 'object',
    },
    {
      field: 'addons',
      type: 'array',
    },
    {
      field: 'custom_sso',
    },
  ] as any,
  validators: {
    email: {
      presence: true,
      email: true,
      length: { minimum: 8 },
    },
    password: {
      presence: true,
      length: { minimum: 6 },
    },
  },
  api: {
    update: 'auth.login',
  },
});

const authReducer = reduceModelManager<IModel>(AuthTypesActions, initialModel);

export default authReducer;
