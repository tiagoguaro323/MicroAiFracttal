import { produce } from 'immer';
import { REHYDRATE } from 'redux-persist';
import { IModel, ModelManager } from 'core/helpers/ModelManager';
import { IAction } from '../actions/actions';
import { IModelActionStatus } from '../actions/asyncModelAction';

export default function reduceModelManager<M extends IModel>(
  AsyncAction: IModelActionStatus,
  initialState: M,
) {
  // eslint-disable-next-line default-param-last
  return (state = initialState, action: IAction<M>): M =>
    produce(state, (newState: any) => {
      switch (action.type) {
        case AsyncAction.Update:
          ModelManager.set(newState, action.payload);
          ModelManager.isValid(newState);
          break;

        case AsyncAction.Loading:
          newState.loading = true;
          break;

        case AsyncAction.Success:
          newState.loading = false;
          ModelManager.loadData(newState, action.payload, true);
          break;

        case AsyncAction.Failure:
          newState.loading = false;
          ModelManager.rollback(newState);
          break;

        case REHYDRATE:
          if (action.payload) {
            newState = action.payload;
            newState.loading = false;
          }
          break;
      }
    });
}
