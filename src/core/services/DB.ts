import { IResponse } from 'core/helpers/IRpc';
import rpc from 'core/services/Backend';
import { IRpc } from './RequestRpc';

const DB = (
  func: string,
  parameters: any,
  callBack: (res: IRpc) => void,
  disabledBatch?: boolean,
) => {
  rpc.invoke(func, parameters, disabledBatch).then(callBack);
};

export const DBA = async (
  func: string,
  parameters: any,
  disabledBatch?: boolean,
) => {
  return new Promise<IResponse>((resolver) => {
    rpc.invoke(func, parameters, disabledBatch).then((res: IRpc) =>
      resolver(
        res.result ||
          ({
            success: false,
            message: 'ERROR_FRONT',
            data: null,
            total: 0,
          } as IResponse),
      ),
    );
  });
};

export default DB;
