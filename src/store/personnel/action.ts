import {
  DataActionStatus,
  createDataList,
  createViewChange,
  createDataDrop,
  createDataSync,
  createDataCreate,
  createDataUpdate,
  createDataUpdateValidations,
  createCommit,
} from 'store/helpers/actions/asyncDataAction';
import { IModel } from 'core/helpers/ModelManager';
import CreateAction from 'store/helpers/actions/actions';

export const TypesActionPersonnel = DataActionStatus('personnel');

export const listPersonnel = createDataList(TypesActionPersonnel);
export const createPersonnel = createDataCreate<IModel>(TypesActionPersonnel);
export const updatePersonnel = createDataUpdate<IModel>(TypesActionPersonnel);
export const updateValidationsPersonnel =
  createDataUpdateValidations<IModel>(TypesActionPersonnel);
export const dropPersonnel = createDataDrop<IModel>(TypesActionPersonnel);
export const viewPersonnel = createViewChange<any>(
  TypesActionPersonnel.ViewChange,
);
export const viewCommit = createCommit<any>(TypesActionPersonnel.Commit);
export const syncPersonnel = createDataSync(TypesActionPersonnel);
export const rollbackPersonnel = CreateAction<void>(
  TypesActionPersonnel.Rollback,
);
