import { DataManager, IData } from 'core/helpers/DataManager';
import { IModel } from 'core/helpers/ModelManager';
import { IAction } from '../actions/actions';
import { IDataActionStatus } from '../actions/asyncDataAction';

export default function reduceDataManager<M extends IModel, S extends IData<M>>(
  AsyncAction: IDataActionStatus,
  initialState: S,
) {
  // eslint-disable-next-line default-param-last
  return (state = initialState, action: IAction<M | M[] | any | string>): S => {
    return DataManager.reducer<M>(
      state,
      action.type,
      action.payload,
      AsyncAction,
    ) as S;
  };
}
