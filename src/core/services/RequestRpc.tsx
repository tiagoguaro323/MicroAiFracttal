import { v4 as uuidv4 } from 'uuid';
import { IResponse } from 'core/helpers/IRpc';

export interface IRpc {
  id: string;
  jsonrpc: string;
  method: string;
  params: any;
  result?: IResponse;
}

export class RequestRpc {
  public id: string;

  public DisableBatching = false;

  public method: string;

  public params: any;

  public isSend = false;

  public timeSend = 0;

  public timeCreated = 0;

  public tried = 0;

  public call: any;

  constructor(method: string, params: any) {
    this.id = `${uuidv4()}`;
    this.method = method;
    this.params = params;
  }

  public payload(): IRpc {
    return {
      id: this.id,
      jsonrpc: '2.0',
      method: this.method,
      params: this.params ? this.params : [],
    };
  }

  public then(call: (data: IRpc) => void) {
    this.call = call;
  }
}
