/* eslint-disable import/order */
import store, { reset } from 'store';
import { mainSuccess } from 'store/main/actions';
import axios, { AxiosInstance } from 'axios';
import { Capacitor } from '@capacitor/core';
import deployInfo from 'deploy-info.json';
import { io } from 'socket.io-client';
import JWT from './JWT';
import { IRpc, RequestRpc } from './RequestRpc';

if (deployInfo.tag === '___TAG___') {
  deployInfo.tag = '5.dev';
}

const HOST = import.meta.env.VITE_APP_URL_API || '';

export class BackendService {
  private static instance: BackendService;

  public socket: any = null;

  public http: AxiosInstance | null = null;

  private msQueue = 300;

  private maxQueueSize = 10;

  private msTimeOutRpc = 80000;

  private queueWaitRpc: RequestRpc[] = [];

  private bufferRpc: RequestRpc[] = [];

  private token = '';

  private timeoutID: any = null;

  private constructor() {
    this.configHttp();
  }

  public clearBufferTimeout() {
    const callbackError: RequestRpc[] = [];

    this.bufferRpc = this.bufferRpc.filter((req) => {
      if (req.isSend && Date.now() - req.timeSend >= this.msTimeOutRpc) {
        callbackError.push(req);
        return false;
      }
      return true;
    });

    callbackError.forEach((req) => {
      // eslint-disable-next-line no-console
      console.log('Req Timeout: ', req);
      req.call({
        ...req.payload(),
        result: {
          success: false,
          message: 'TIMEOUT_DEVICE_STATUS',
          data: null,
          total: 0,
        },
      });
    });
  }

  public static getInstance(): BackendService {
    if (!BackendService.instance) {
      BackendService.instance = new BackendService();
    }

    // Clear Buffer timeout
    setInterval(
      BackendService.instance.clearBufferTimeout.bind(BackendService.instance),
      10000,
    );

    return BackendService.instance;
  }

  private configHttp() {
    this.http = axios.create({
      baseURL: HOST,
      timeout: 100000,
      headers: {
        Authorization: `Bearer ${JWT.getToken()}`,
        'x-version': `Fracttal/${deployInfo.tag} ${Capacitor.getPlatform()}`,
      },
    });

    this.http.interceptors.request.use((config) => {
      if (config && config.headers)
        config.headers.Authorization = `Bearer ${JWT.getToken()}`;
      return config;
    });

    this.http.interceptors.response.use(undefined, (err) => {
      const error = err.response;
      if (error?.status === 401 && window.location.href.search('/signin') < 0) {
        store.dispatch(reset());
        window.location.href = '/signin';
      }
    });
  }

  private configSocket() {
    this.socket = io(HOST, {
      path: '/rpc/ws',
      query: {
        // sent in the query parameters
        token: JWT.getToken(),
      },
      extraHeaders: {
        'x-version': `Fracttal/${deployInfo.tag} ${Capacitor.getPlatform()} ${Capacitor.getPlatform() === 'web' ? '' : '[mobile]'}`,
      },
    });

    this.socket
      .on('connect', () => {
        this.flushBufferRpc();
      })
      .on('disconnect', (reason: string) => {
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          this.connect(this.token);
        }
      })
      .on('connect_error', (err: any) => {
        if (err.message === 'no token provided' || err.message === 'timeout') {
          this.token = JWT.getToken();
          this.socket.io.opts.query.token = this.token;
          this.socket.disconnect();
          if (this.token !== '') {
            this.socket.connect();
          }
        }
      })
      .on('rpc_event', (event: any) => {
        const dateOb = new Date();
        store.dispatch(
          mainSuccess({
            msg: `${event.method} - ${dateOb.toString()}`,
          }),
        );
      })
      .on('response', this.onResult.bind(this))
      .on('request_error', () => {
        const dateOb = new Date();
        // eslint-disable-next-line no-console
        console.error('request_error: ', `${dateOb.toString()}`);
      });
  }

  /** Call this method to add your socket.io request to queue */
  public invoke(
    methodOrRequest: string | RequestRpc,
    params?: any,
    disableBatching?: boolean,
  ) {
    if (typeof methodOrRequest === 'string') {
      methodOrRequest = new RequestRpc(methodOrRequest, params);
      if (disableBatching) methodOrRequest.DisableBatching = true;
    }
    return this.addRequestToQueue(methodOrRequest);
  }

  private addBufferRpc(requests: RequestRpc[]) {
    requests.forEach((request) => {
      this.bufferRpc.unshift(request);
    });
    this.flushBufferRpc();
  }

  private moveQueueToRpc() {
    clearTimeout(this.timeoutID);
    this.timeoutID = null;
    this.addBufferRpc(this.queueWaitRpc);
    this.queueWaitRpc = [];
  }

  private addQueueWaitRpc(request: RequestRpc) {
    this.queueWaitRpc.push(request);
    if (this.queueWaitRpc.length >= this.maxQueueSize) {
      this.moveQueueToRpc();
    } else if (this.timeoutID === null) {
      this.timeoutID = setTimeout(() => this.moveQueueToRpc(), this.msQueue);
    }
  }

  private addRequestToQueue(request: RequestRpc) {
    if (this.msQueue === 0 || request.DisableBatching) {
      this.addBufferRpc([request]);
    } else {
      this.addQueueWaitRpc(request);
    }

    return request;
  }

  private onResult(result: any) {
    let requestCallback: any = null;

    this.bufferRpc = this.bufferRpc.filter((req) => {
      if (req && req.id === result.id) {
        requestCallback = req;
        return false;
      }
      return true;
    });

    requestCallback &&
      requestCallback.call({ ...result, params: requestCallback.params });
  }

  private flushBufferRpc() {
    if (this.bufferRpc.length > 0) {
      const sendDB: IRpc[] = this.bufferRpc
        .filter((req) => !req.isSend)
        .map((req) => req.payload());

      this.bufferRpc = this.bufferRpc.map((req) => {
        if (!req.isSend) {
          req.timeSend = Date.now();
          req.isSend = true;
        }
        return req;
      });

      if (sendDB.length > 0) {
        this.http &&
          this.http.post('/rpc/proxy', sendDB).then((response) => {
            // handle success
            if (response) {
              const dbResponse = Array.isArray(response.data)
                ? response.data
                : [];
              dbResponse.forEach((resp) => this.onResult(resp));
            }
          });
        // this.socket.emit('rpc', sendDB);
      }
    }
  }

  public disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
    if (this.http) {
      this.http.defaults.headers.common.Authorization = '';
    }
    this.bufferRpc = [];
  }

  public connect(token: string): void {
    if (this.token !== token) {
      this.token = token;
      if (this.socket && !this.socket.connected) {
        this.socket.io.opts.query.token = token;
        this.socket.disconnect().connect();
      }
    }
  }
}

export default BackendService.getInstance();
