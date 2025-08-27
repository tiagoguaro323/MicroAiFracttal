import validate from 'validate.js';
import { v4 as uuidv4 } from 'uuid';
import clone from 'clone';
import objectPath from 'object-path';
import i18n from 'i18n';
import { IApi, IErrors } from './IRpc';

export interface IFilter {
  type:
    | 'location'
    | 'string'
    | 'boolean'
    | 'numeric'
    | 'numericRange'
    | 'date'
    | 'datetimetz'
    | 'time'
    | 'currency'
    | 'list'
    | 'multiselect'
    | 'hours'
    | 'dependentList';
  source?: string;
  field?: string;
  options?: any;
  parameters?: any;
  operator?: string;
  fieldSearch?: string;
  isParentLocation?: boolean;
  typesAsset?: number[];
  customFieldsApi?: string;
  dependentFieldChild?: string;
  dependentField?: string;
  checkboxOption?: boolean;
}

export interface ISort {
  field?: string;
}

export type anyType =
  | 'string'
  | 'boolean'
  | 'numeric'
  | 'numericRange'
  | 'date'
  | 'datetimetz'
  | 'time'
  | 'currency'
  | 'object'
  | 'array'
  | 'hours'
  | 'rating';

export interface IValid {
  // <field name>
  [field: string]: {
    // <validator name>: <validator options> ** validator(NOT FUNCTION)
    [validator: string]: any;
  };
}

export interface IPrediction {
  description: string;
  hash: string;
  confidence: number;
}

export interface IModel {
  [field: string]: any;
  columns: any;
  idInternal: string;
  primaryKey: string;
  edited: boolean;
  phantom: boolean;
  loading: boolean;
  autoSync: boolean;
  errors: IErrors;
  // CRUDL Object
  api?: IApi;
  // https://validatejs.org
  // <field name>: <validator options>
  validators?: IValid;
}

const capitalizeTransform = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1).replaceAll('_', ' ');
};

export abstract class ModelManager {
  public static init<M extends IModel>(
    init: {
      [field: string]: any;
      primaryKey?: string;
      autoSync?: boolean;
      columns?: any;
      validators?: IValid;
      api?: IApi;
    } = {},
  ): M {
    const model: IModel = {
      primaryKey: 'id',
      autoSync: false,
      api: {},
      validators: {},
      columns: [] as any,
      ...init,
      idInternal: uuidv4(),
      edited: false,
      phantom: false,
      loading: false,
      errors: {},
    };

    let columns: any[] = [];
    const keysFields = ModelManager.getFields(model);
    keysFields.forEach((key) => {
      if (model.columns.findIndex((c) => c.field) < 0) {
        columns.push({
          type: 'string',
          field: key,
          commitValue: model[key],
        });
      }
    });

    columns = columns.concat(model.columns);

    columns.forEach((column: any) => {
      const col = clone(column);

      if (model[col.field] !== undefined) {
        col.commitValue = model[col.field];
      } else if (col.defaultValue !== undefined) {
        col.commitValue = col.defaultValue;
      } else if (col.allowNull) {
        col.commitValue = null;
      } else {
        switch (col.type) {
          case 'numeric':
            col.commitValue = 0;
            break;
          case 'numericRange':
            col.commitValue = 0;
            break;
          case 'boolean':
            col.commitValue = false;
            break;
          case 'object':
            col.commitValue = {};
            break;
          case 'date':
          case 'datetimetz':
          case 'time':
            col.commitValue = new Date();
            break;
          case 'array':
            col.commitValue = [];
            break;
          default:
            col.type = 'string';
            col.commitValue = '';
        }
      }

      model.columns.push(col);

      Object.defineProperty(model, col.field, {
        value: col.commitValue,
        enumerable: true,
        writable: true,
      });
    });

    if (!Object.keys(model).includes(model.primaryKey)) {
      model.columns.push({
        type: 'string',
        field: model.primaryKey,
        commitValue: model.idInternal,
      });

      Object.defineProperty(model, model.primaryKey, {
        value: model.idInternal,
        enumerable: true,
        writable: true,
      });
      model.phantom = true;
    } else {
      model.phantom =
        typeof model[model.primaryKey] === 'string' &&
        model[model.primaryKey] === '';
      model.phantom =
        typeof model[model.primaryKey] === 'number' &&
        model[model.primaryKey] === 0;
    }

    ModelManager.isValid(model);
    return model as M;
  }

  public static getFields(model: IModel) {
    return Object.keys(model).filter(
      (key: string) =>
        ![
          'columns',
          'idInternal',
          'primaryKey',
          'edited',
          'phantom',
          'loading',
          'autoSync',
          'errors',
          'api',
          'validators',
        ].includes(key),
    );
  }

  public static getConfigColumn(model: IModel, field: string) {
    return model.columns.filter((column: any) => column.field === field)[0];
  }

  public static getColumnTranslatedTitle(column: any) {
    if (column?.translationTag) {
      if (typeof column.translationTag === 'string')
        return i18n.t(column.translationTag);
    }

    return column?.title || '';
  }

  public static setCommitValue(model: IModel, field: string, value: any) {
    const fields = model.columns.filter(
      (column: any) => column.field === field,
    );

    if (fields.length > 0) {
      fields[0].commitValue = value;
    }
  }

  public static updateValidations(model: IModel, validators: any) {
    model.validators = validators;

    return ModelManager.isValid(model);
  }

  public static set(model: IModel, source: any, commit = false) {
    ModelManager.getFields(model)
      .filter((key) => source[key] !== undefined && model[key] !== source[key])
      .forEach((key) => {
        model[key] = source[key];
        if (commit) {
          ModelManager.setCommitValue(model, key, source[key]);
          model.edited = false;
          model.phantom = false;
        } else {
          model.edited = true;
          if (key === model.primaryKey) {
            model.phantom = model[key] === model.idInternal;
          }
        }
      });

    return ModelManager.isValid(model);
  }

  public static getId(model: IModel) {
    return (model && model[model.primaryKey]) || null;
  }

  public static getData(model: IModel) {
    const data: any = {};
    ModelManager.getFields(model).forEach((key) => {
      data[key] = model[key];
    });
    return data;
  }

  public static getEditedData(model: IModel) {
    const data: any = {};
    data[model.primaryKey] = model[model.primaryKey];
    ModelManager.getFields(model).forEach((field: string) => {
      const configCol = ModelManager.getConfigColumn(model, field);
      if (
        model[field] !== undefined &&
        configCol !== undefined &&
        (model.phantom ||
          configCol.critical ||
          model[field] !== configCol.commitValue)
      ) {
        data[field] = model[field];
      }
    });
    return data;
  }

  public static rollback(model: IModel) {
    model.columns.forEach((column: any) => {
      model[column.field] = column.commitValue;
    });
    model.edited = false;
  }

  public static commit(model: IModel) {
    model.columns.forEach((column: any) => {
      column.commitValue = model[column.field];
    });
    model.edited = false;
    model.phantom = false;
  }

  public static isValid(model: IModel) {
    let error: any = {};

    if (model.validators) {
      const data = ModelManager.getData(model);
      error = validate(data, model.validators);
      model.errors = {};
      if (error) {
        model.errors = { ...error };
        Object.keys(error).forEach((field: string) => {
          const column = ModelManager.getConfigColumn(model, field);
          const columnTitle = ModelManager.getColumnTranslatedTitle(column);

          if (column && columnTitle && Array.isArray(error[field])) {
            error[field].forEach((t: string, index: number) => {
              const toName = capitalizeTransform(field);
              if (t.search(toName) >= 0) {
                model.errors[field][index] = t.replace(toName, columnTitle);
              }
            });
          }
        });
      }
    }
    return !(error && Object.keys(error).length > 0);
  }

  public static isEdited(model: IModel) {
    return model.edited;
  }

  public static isPhantom(model: IModel) {
    return model.phantom || model.phantom === undefined;
  }

  public static isDirty(model: IModel) {
    return model.phantom || model.edited;
  }

  public static isEditedField(model: IModel, fields: string | string[]) {
    if (model.phantom) return true;
    const edited = Object.keys(ModelManager.getEditedData(model));
    fields = Array.isArray(fields) ? fields : [fields];
    return edited.filter((field) => fields.includes(field)).length > 0;
  }

  public static getErrors(model: IModel) {
    return clone(model.errors || {});
  }

  public static loadData(model: IModel, data: any, commit = false) {
    if (data) {
      Object.keys(data).forEach((key: string) => {
        model[key] = data[key];
      });

      ModelManager.updateMapping(model);

      ModelManager.isValid(model);

      if (commit) {
        ModelManager.commit(model);
      } else {
        model.edited = true;
      }
    }
  }

  public static updateMapping(model: IModel) {
    model.columns.forEach((column: any) => {
      if (column.mapping !== undefined)
        model[column.field] = objectPath.get(model, column.mapping);
    });
  }
}
