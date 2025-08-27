import { RequestRpc, IRpc } from 'core/services/RequestRpc';
import rpc from 'core/services/Backend';
import clone from 'clone';
import objectPath from 'object-path';
import { REHYDRATE } from 'redux-persist';
import { produce } from 'immer';
import store from 'store';
import { mainError, mainSuccess } from 'store/main/actions';
import i18n from 'i18n';
import { IModel, ModelManager, IValid } from './ModelManager';
import { IApi, IErrors } from './IRpc';

export const ISortDataDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type ISortData = {
  property: string;
  direction?: (typeof ISortDataDirection)[keyof typeof ISortDataDirection];
};

export interface IData<T extends IModel> {
  maxSize: number;
  currentPage: number;
  loading: boolean;
  autoLoad: boolean;
  append: boolean;
  autoSync: boolean;
  columns: any[];
  total: number;
  node: any | null;
  isTree: boolean;
  isSync: boolean;

  deleted: T[];
  data: T[];
  errors: IErrors;
  errorData: any[];
  api?: IApi;
  mappingData: string;
  mappingTotal: string;
  mappingMsg: string;
  mappingIsTree: string;
  mappingNodeList: string;
  primaryKey?: string;
  message: string;

  batch: boolean;
  listDisableBatch: boolean;
  initParameters?: any;
  parameters: any;
  lastParameters: any;
  queries: {
    filter?: any;
    group?: ISortData;
    sort?: ISortData[];
  };
  initQueries?: {
    filter?: any;
    group?: ISortData;
    sort?: ISortData[];
  };
  validators?: IValid;
}

export type IDataQuery = (
  type:
    | 'list'
    | 'sort'
    | 'filters'
    | 'group'
    | 'refresh'
    | 'page'
    | 'view'
    | 'create'
    | 'read'
    | 'update'
    | 'delete'
    | 'sync'
    | 'rollback'
    | 'updateValidations'
    | 'config',
  query?: any,
  autoSync?: boolean,
  commit?: boolean,
  autoList?: boolean,
) => void;

export type IDataInit = {
  maxSize?: number;
  currentPage?: number;
  append?: boolean;
  autoLoad?: boolean;
  autoSync?: boolean;
  primaryKey?: string;
  columns?: any;
  api?: IApi;
  parameters?: any;
  initParameters?: any;
  mappingData?: string;
  mappingTotal?: string;
  mappingMsg?: string;
  mappingIsTree?: string;
  mappingNodeList?: string;
  validators?: IValid;
  isTree?: boolean;
  node?: any | null;
  batch?: boolean;
  listDisableBatch?: boolean;
  queries?: {
    filter?: any;
    group?: ISortData;
    sort?: ISortData[];
  };
  initQueries?: {
    filter?: any;
    group?: ISortData;
    sort?: ISortData[];
  };
  data?: any[];
};

export abstract class DataManager {
  public static init<T extends IModel>(initState: IDataInit = {}): IData<T> {
    const init: IData<T> = {
      total: 0,
      maxSize: 50,
      currentPage: 1,
      append: true,
      autoLoad: true,
      autoSync: false,
      data: [],
      columns: [],
      parameters: {},
      primaryKey: 'id',
      mappingData: 'data',
      mappingTotal: 'total',
      mappingMsg: 'message',
      mappingIsTree: 'is_tree',
      mappingNodeList: 'node',
      message: '',
      isTree: false,
      node: null,
      queries: {
        filter: [],
        group: undefined,
        sort: [],
      },
      batch: false,
      listDisableBatch: false,
      ...initState,
      lastParameters: {},
      loading: false,
      isSync: false,
      errors: {},
      errorData: [],
      deleted: [],
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return produce(init, () => {});
  }

  public static getDefModel<T extends IModel>(source: IData<T>) {
    return {
      ...clone({ ...source.parameters, ...source.lastParameters }),
      columns: DataManager.getColumns(source),
      validators: DataManager.getValidators(source),
    };
  }

  public static getValidators<T extends IModel>(source: IData<T>) {
    return source.validators ? clone(source.validators) : undefined;
  }

  public static clone<T extends IModel>(source: IData<T>) {
    return clone(source);
  }

  public static newModel<T extends IModel>(
    source: IData<T>,
    data: any = {},
    commit = false,
  ) {
    const model = ModelManager.init<T>({
      primaryKey: source.primaryKey,
      columns: DataManager.getColumns(source),
      validators: DataManager.getValidators(source),
    });
    ModelManager.loadData(model, data, commit);
    return clone(model);
  }

  public static create<T extends IModel>(source: IData<T>, data: any = {}) {
    source.data.unshift(DataManager.newModel(source, data));
    source.total++;
  }

  public static update<T extends IModel>(
    source: IData<T>,
    item: T | T[],
    commit = false,
  ) {
    const models = Array.isArray(item) ? item : [item];
    models.forEach((model) => {
      const idModel = ModelManager.getId(model);
      const index = source.data.findIndex(
        (target) =>
          ModelManager.getId(target) === idModel ||
          ModelManager.getId(target) === model[target.primaryKey] ||
          target.idInternal === model.idInternal,
      );

      if (index >= 0) {
        ModelManager.set(source.data[index], model, model.commit || commit);
      }
    });
  }

  public static updateValidations<T extends IModel>(
    source: IData<T>,
    payload: any,
  ) {
    const { idModel, validators } = payload;
    const index = source.data.findIndex(
      (target) => ModelManager.getId(target) === idModel,
    );
    if (index >= 0) {
      ModelManager.updateValidations(source.data[index], validators);
    }
  }

  public static delete<T extends IModel>(source: IData<T>, model: T | string) {
    const id = typeof model === 'string' ? model : ModelManager.getId(model);
    const deleteIndex = source.data.findIndex(
      (item) => ModelManager.getId(item) === id,
    );

    if (deleteIndex >= 0) {
      const item = source.data[deleteIndex];
      !ModelManager.isPhantom(item) &&
        source.deleted.push({ ...source.data[deleteIndex], deleteIndex });
      source.data.splice(deleteIndex, 1);
      source.total--;
    }
  }

  public static loadData<T extends IModel>(
    source: IData<T>,
    data: any[],
    commit = false,
  ) {
    source.deleted = [];

    if (source.currentPage === 1) {
      if (source.isTree && source.node > 0) {
        // Clear Node
        source.data = source.data.filter(
          (item: any) => item.id_parent !== source.node,
        );
      } else {
        // Clear All
        source.data = [];
      }
    }

    if (data && data.length > 0) {
      data.forEach((raw: T) => {
        const model = DataManager.newModel(source, raw, commit);
        if (
          source.data.filter(
            (item) => ModelManager.getId(item) === ModelManager.getId(model),
          ).length === 0
        ) {
          source.data.push(model);
        }
      });
    }
  }

  public static clear<T extends IModel>(source: IData<T>) {
    source.deleted = [];
    source.data = [];
    source.errors = {};
  }

  public static rollback<T extends IModel>(source: IData<T>) {
    let oldData: T[] = [];
    oldData = source.data.filter((item) => !item.phantom);
    const phantoms = source.data.filter((item) => item.phantom);
    source.deleted
      .filter((item) => !item.phantom)
      .forEach((item) => {
        const newItem = { ...item };
        delete newItem.deleteIndex;
        oldData.splice(item.deleteIndex, 0, newItem);
      });

    oldData
      .filter((item) => item.edited)
      .forEach((item: any) => {
        ModelManager.rollback(item);
      });

    source.data = oldData;
    source.deleted = [];
    source.errors = {};
    source.total -= phantoms.length;
  }

  public static commit<T extends IModel>(source: IData<T>) {
    const newData: T[] = [];
    source.data.map((item) => newData.push(item));

    newData.forEach((item: any) => {
      ModelManager.commit(item);
    });

    source.data = newData;
  }

  public static listParameters<T extends IModel>(source: IData<T>) {
    return {
      filter: source.queries.filter,
      sort: source.queries.sort,
      group: source.queries.group,
      page: source.currentPage,
      limit: source.maxSize,
      start: (source.currentPage - 1) * source.maxSize,
      [source.mappingIsTree]: source.isTree,
      [source.mappingNodeList]: source.node,
      ...source.parameters,
      ...source.lastParameters,
    };
  }

  public static isValid<T extends IModel>(source: IData<T>) {
    const errors = source.data.filter(
      (model: IModel) => Object.keys(model.errors).length > 0,
    );
    return errors.length === 0;
  }

  public static isEdited<T extends IModel>(source: IData<T>) {
    return (
      source.deleted.length > 0 ||
      source.data.filter((model: IModel) => model.edited).length > 0
    );
  }

  public static isPhantom<T extends IModel>(source: IData<T>) {
    return source.data.filter((model: IModel) => model.phantom).length > 0;
  }

  public static isDirty<T extends IModel>(source: IData<T>) {
    return (
      source.deleted.length > 0 ||
      source.data.filter((model: IModel) => model.phantom || model.edited)
        .length > 0
    );
  }

  public static getData<T extends IModel>(source: IData<T>) {
    return (
      (source.data &&
        source.data.map((model: IModel) => {
          return ModelManager.getData(model);
        })) ||
      []
    );
  }

  public static getById<T extends IModel>(source: IData<T>, key: string) {
    return (
      source.data.filter(
        (model: IModel) =>
          ModelManager.getId(model).toString() === key.toString(),
      )[0] || null
    );
  }

  public static getEditedData<T extends IModel>(source: IData<T>) {
    return source.data.filter((model: IModel) => model.edited);
  }

  public static getColumns<T extends IModel>(source: IData<T>) {
    return clone(source.columns.filter((col) => col.field !== 'id'));
  }

  public static getGroup<T extends IModel>(source: IData<T>) {
    const { group } = source.queries;
    if (group && group.property) {
      let title = '';
      source.columns
        .filter((item: any) => item.field === group.property)
        .forEach((item: any) => {
          title = item.title;
        });

      return {
        property: group.property,
        direction: (group.direction || 'asc').toLowerCase(),
        title,
      };
    }

    return undefined;
  }

  public static getSort<T extends IModel>(source: IData<T>) {
    const { sort } = source.queries;

    return (
      (sort &&
        sort.map((sort) => {
          let title = '';
          source.columns
            .filter((item: any) => item.field === sort.property)
            .forEach((item: any) => {
              title = item.title;
            });
          return {
            property: sort.property,
            direction: (sort.direction || 'asc').toLowerCase(),
            title,
          };
        })) ||
      []
    );
  }

  public static getFilters<T extends IModel>(source: IData<T>) {
    const { filter: filters } = source.queries;

    return (
      (filters &&
        filters.map((filter) => {
          let title = '';
          source.columns
            .filter((item: any) => item.field === filter.property)
            .forEach((item: any) => {
              title = item.title;
            });

          return {
            property: filter.property,
            operator: filter.operator,
            value: filter.value,
            title,
          };
        })) ||
      []
    );
  }

  public static reducer<T extends IModel>(
    source: IData<T>,
    action: string,
    payload?: any,
    actions: any = {
      ViewChange: 'ViewChange',
      Create: 'Create',
      Read: 'Read',
      Update: 'Update',
      Delete: 'Delete',
      Loading: 'Loading',
      Success: 'Success',
      Rollback: 'Rollback',
      Error: 'Error',
      Commit: 'Commit',
      Message: 'Message',
      Config: 'Config',
      UpdateValidations: 'UpdateValidations',
    },
  ) {
    return produce(source, (draftState: any) => {
      switch (action) {
        case actions.Config:
          draftState.parameters = payload;
          break;

        case actions.Message:
          draftState.message = objectPath.get(payload, draftState.mappingMsg);
          break;

        case actions.ViewChange:
          draftState.columns = payload.columns;
          break;

        case actions.Loading:
          {
            const { params, extraParameters } = payload;

            draftState.loading = true;
            // draftState.lastParameters = {};

            if (params && params.append !== undefined) {
              draftState.append = params.append;
            }

            if (params && params.maxSize !== undefined) {
              draftState.maxSize = params.maxSize;
            }

            if (params && params.currentPage !== undefined) {
              draftState.currentPage = params.currentPage;
            }

            if (params && params.isTree !== undefined) {
              draftState.isTree = params.isTree;
            }

            if (params && params.node !== undefined) {
              draftState.node = params.node;
            }

            if (params && params.sync) {
              draftState.isSync = params.sync;
            }

            if (params && params.queries !== undefined) {
              draftState.queries = {
                ...draftState.queries,
                ...params.queries,
              };
            }

            if (extraParameters) {
              draftState.lastParameters = {
                ...extraParameters,
              };
            }
          }
          break;

        case actions.Create:
          DataManager.create<T>(draftState, payload as T);
          break;

        case actions.Read:
          DataManager.update<T>(draftState, payload as T);
          break;

        case actions.Update:
          DataManager.update<T>(draftState, payload as T);
          break;

        case actions.UpdateValidations:
          DataManager.updateValidations<T>(draftState, payload);
          break;

        case actions.Delete:
          DataManager.delete<T>(draftState, payload as T | string);
          break;

        case actions.Success:
          {
            draftState.loading = false;
            draftState.isSync = false;
            draftState.errors = {};
            draftState.deleted = [];

            const total = objectPath.get(payload, draftState.mappingTotal);
            const message =
              objectPath.get(payload, draftState.mappingMsg) || '';
            let data = objectPath.get(payload, draftState.mappingData);

            if (payload && data && (payload.update || payload.create)) {
              draftState.message = message;
              data = Array.isArray(data) ? data : [data];
              data.forEach((item: any) =>
                DataManager.update(draftState, item, true),
              );
            } else if (payload && payload.read) {
              draftState.message = message;
              draftState.total = total;
              data = data || [];
              data = Array.isArray(data) ? data : [data];
              DataManager.loadData(draftState, data, true);
            }
            DataManager.commit<T>(draftState);
          }
          break;

        case actions.Rollback:
          draftState.loading = false;
          draftState.isSync = false;
          draftState.errors = {};
          draftState.errorData = (payload && payload.data) || [];
          draftState.message =
            (payload && payload.message) || draftState.message;
          DataManager.rollback<T>(draftState);
          break;

        case actions.Commit:
          draftState.loading = false;
          draftState.isSync = false;
          draftState.errors = {};
          draftState.deleted = [];
          DataManager.commit<T>(draftState);
          break;

        case actions.Error:
          draftState.loading = false;
          draftState.isSync = false;
          draftState.errors = {};
          if (payload && payload.delete) {
            DataManager.rollback<T>(draftState);
          }
          break;

        case REHYDRATE:
          draftState = payload;
          if (draftState) {
            draftState.loading = false;
            draftState.isSync = false;
            draftState.deleted = [];
            draftState.errors = {};
            draftState.data = [];
            draftState.total = 0;
            draftState.node = null;
            draftState.isTree = false;
            draftState.lastParameters = {};
            draftState.message = '';
            draftState.currentPage = 1;
          }
          break;
      }
    });
  }

  public static sync<T extends IModel>(
    source: IData<T>,
    onResult: (result: any) => void,
    onError: (result: any) => void,
  ) {
    const requests: RequestRpc[] = [];
    let withErrors = false;

    // Data for create or Edit
    const createItems = source.data
      .filter((item: IModel) => item.phantom && source.api && source.api.create)
      .map((item: IModel) => {
        Object.keys(item.errors).length > 0 && (withErrors = true);
        return {
          ...ModelManager.getEditedData(item),
          idInternal: item.idInternal,
        };
      });

    if (createItems.length > 0 && source.batch) {
      const req = new RequestRpc(source.api?.create || '', createItems);
      requests.push(req);
    } else {
      createItems.forEach((item) => {
        const req = new RequestRpc(source.api?.create || '', item);
        requests.push(req);
      });
    }

    const editItems = source.data
      .filter(
        (item: IModel) =>
          !item.phantom && item.edited && source.api && source.api.update,
      )
      .map((item: IModel) => {
        Object.keys(item.errors).length > 0 && (withErrors = true);
        return ModelManager.getEditedData(item);
      });

    if (editItems.length > 0 && source.batch) {
      const req = new RequestRpc(source.api?.update || '', editItems);
      requests.push(req);
    } else {
      editItems.forEach((item) => {
        const req = new RequestRpc(source.api?.update || '', item);
        requests.push(req);
      });
    }

    if (withErrors) {
      store.dispatch(mainError({ msg: i18n.t('ALERT_REQUIERED_FIELDS') }));
      return false;
    }

    if (source.api && source.api.delete) {
      const deleteItems = source.deleted.map((item) => ({
        [item.primaryKey]: ModelManager.getId(item),
      }));
      if (deleteItems.length > 0 && source.batch) {
        const req = new RequestRpc(source.api?.delete || '', deleteItems);
        requests.push(req);
      } else {
        deleteItems.forEach((item) => {
          const req = new RequestRpc(source.api?.delete || '', item);
          requests.push(req);
        });
      }
    }

    // exec all request
    requests.forEach((request: RequestRpc) => {
      rpc
        .invoke(request)
        .then(({ id: idRequest, method, params, result }: IRpc) => {
          const actions = {
            create: false,
            read: false,
            update: false,
            delete: false,
          };
          const index = requests.findIndex((req) => req.id === idRequest);
          requests.splice(index, 1);

          if (result && result.success) {
            if (
              method === source.api?.create ||
              method === source.api?.update
            ) {
              // tratar de obtener el id de la db y modificar los campos que se cambien en db
              let data = objectPath.get(result, source.mappingData);
              if (data && Array.isArray(data)) {
                params = Array.isArray(params) ? params : [params];
                // reparacion de posible error vacio
                data = data.length === 0 ? params : data;
                data = data.map((item: any, index: number) => ({
                  ...params[index],
                  ...item,
                }));
              } else if (data === null) {
                data = { ...params };
              } else if (typeof params === 'object') {
                data = { ...params, ...data };
              }
              objectPath.set(result, source.mappingData, data);
              actions.create = method === source.api?.create;
              actions.update = method === source.api?.update;
              actions.delete = false;
            } else if (
              method === source.api?.read ||
              method === source.api?.list
            ) {
              actions.read = true;
            } else if (method === source.api?.delete) {
              store.dispatch(mainSuccess({ msg: i18n.t('ACTION_DONE') }));
            }

            onResult && onResult({ ...result, ...actions });
          } else if (result) {
            if (
              method !== source.api?.create &&
              method !== source.api?.update
            ) {
              actions.delete = true;
            }
            onError && onError({ ...result, ...actions });
          }
        });
    });

    return requests.length > 0;
  }

  public static list<T extends IModel>(
    source: IData<T>,
    onResult: (result: any) => void,
    onError: (result: any) => void,
  ) {
    if (source.api && source.api.list) {
      rpc
        .invoke(
          source.api.list,
          DataManager.listParameters(source),
          source.listDisableBatch,
        )
        .then((res: IRpc) => {
          const { result } = res;
          if (result && result.success) {
            onResult &&
              onResult({
                ...result,
                create: false,
                read: true,
                update: false,
                delete: false,
              });
          } else if (result) {
            onError && onError(result);
          }
        });
    }
  }

  public static setConfig<T extends IModel>(
    source: IData<T>,
    config: IDataInit,
  ) {
    source = {
      ...source,
      parameters: config.parameters || source.parameters,
      append: config.append || source.append,
      autoLoad: config.autoLoad || source.autoLoad,
      autoSync: config.autoSync || source.autoSync,
    };
  }
}
