import { useState, useCallback, useEffect } from 'react';
import { IModel, ModelManager } from 'core/helpers/ModelManager';

export default function useModelUpdate(
  index: number,
  model: IModel,
  onQuery: any,
  addAction: any,
  removeAction: any,
  autoUpdate?: boolean,
) {
  const [, setDelayID] = useState<number | null>(null);
  const [changed, setChanged] = useState<string[]>([]);
  const [modelUpdate, setModelUpdate] = useState<any>({
    ...ModelManager.getData(model),
    errors: ModelManager.getErrors(model),
  });

  useEffect(() => {
    if (ModelManager.isEditedField(model, changed)) {
      addAction &&
        addAction(
          index,
          () => {
            onQuery && onQuery('sync');
          },
          () => {
            onQuery && onQuery('rollback');
          },
        );
    } else {
      removeAction && removeAction(index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModelManager.isEditedField(model, changed)]);

  const clear = useCallback(() => {
    setChanged([]);
    setModelUpdate(ModelManager.getData(model));
  }, [model]);

  const update = useCallback(() => {
    setDelayID((id) => {
      if (id) {
        clearTimeout(id);
      }
      return null;
    });

    setModelUpdate((value: any) => {
      const modelChanged = changed.reduce((acc: any, prop) => {
        acc[prop] = value[prop];
        return acc;
      }, {});
      onQuery('update', { ...model, ...modelChanged });
      return value;
    });
  }, [changed, model, onQuery]);

  const trackChangeModel = useCallback(
    (key: string | any, value: any) => {
      if (typeof key === 'string') {
        setChanged((newChanged) => {
          !newChanged.includes(key) && newChanged.push(key);
          return newChanged;
        });
        setModelUpdate((newModelUpdate: any) => ({
          ...newModelUpdate,
          [key]: value,
        }));
      } else {
        setChanged((newChanged) => {
          Object.keys(modelUpdate).forEach((prop) => {
            !newChanged.includes(key) && newChanged.push(prop);
          });
          return newChanged;
        });
        setModelUpdate((newModelUpdate: any) => ({
          ...newModelUpdate,
          ...key,
        }));
      }

      if (autoUpdate) {
        setDelayID((id) => {
          if (id) clearTimeout(id);
          return <any>setTimeout(() => {
            update();
          }, 1500);
        });
      }
    },
    [autoUpdate, modelUpdate, update],
  );

  return [modelUpdate, trackChangeModel, update, clear];
}
