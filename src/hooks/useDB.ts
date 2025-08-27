/* eslint-disable default-param-last */
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import DB from 'core/services/DB';
import { mainError } from 'store/main/actions';
import i18n from 'i18n';
import { IRpc } from 'core/services/RequestRpc';
import { reset } from 'store';

export default function useDB(
  fnc: string,
  init: any = {},
  autoExec = false,
  transform?: (data: any[]) => any[],
  showErrorMsg?: boolean | undefined,
  disabledBatch?: boolean,
): [
  {
    data: any[];
    loading: boolean;
    success: boolean;
    total: number;
    message: string;
    isExec: boolean;
    currentPage: number;
  },
  (extraParams?: any) => void,
  (filter?: any[]) => void,
  (id: number, newRow: any) => void,
  (id: number) => void,
] {
  const dispatch = useDispatch();

  const [data, setData] = useState<any>({
    data: [],
    loading: false,
    success: false,
    message: '',
    total: 0,
    isExec: false,
    currentPage: 1,
  });

  const [params, setParams] = useState({
    page: 1,
    limit: 50,
    start: 0,
    append: true,
    ...init,
  });

  useEffect(() => {
    autoExec && execDB(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const execDB = useCallback(
    (extraParams: any = {}) => {
      const newParams = { ...params, ...extraParams };

      setData((prevData: any) => ({
        ...prevData,
        loading: true,
        isExec: true,
        currentPage: newParams.page,
      }));

      newParams.start = (newParams.page - 1) * newParams.limit;

      DB(
        fnc,
        newParams,
        ({ result }: IRpc) =>
          setData((prevData: any) => {
            let newData = result && result.data ? result.data : [];
            newData = Array.isArray(newData) ? newData : [newData];
            newData = transform ? transform(newData) : newData;
            const append = newParams.page > 1 && newParams.append;

            if (result && result.success) {
              setParams(newParams);
              return {
                loading: false,
                success: result.success,
                message: result.message,
                total: result.total,
                data: append ? [...prevData.data].concat(newData) : newData,
                isExec: true,
                currentPage: newParams.page,
              };
            }

            setParams({
              page: 1,
              limit: 50,
              start: 0,
              append: true,
              ...init,
            });

            if (result) {
              if (result.message === 'USER_NOT_LOGIN') {
                dispatch(reset());
                dispatch(push('/signin'));
              } else {
                showErrorMsg &&
                  dispatch(mainError({ msg: i18n.t(result.message) }));
              }
            }

            return {
              loading: false,
              success: false,
              message: result?.message || '',
              total: result?.total || 0,
              data: append ? [...prevData.data].concat(newData) : newData,
              isExec: true,
              currentPage: 1,
            };
          }),
        disabledBatch,
      );
    },
    [params, fnc, disabledBatch, transform, init, dispatch, showErrorMsg],
  );

  const nextPage = useCallback(
    (filter?: any[]) => {
      execDB({ page: params.page + 1, filter });
    },
    [execDB, params],
  );

  /**
   * Intenta actualizar el row en caso de encontrarlo, de lo contrario lo inserta en la primera posicion
   */
  const rowUpdate = useCallback(
    (id: number, newRow: any) => {
      const newData = [...data.data];
      const index = newData.findIndex((r: any) => r.id === id);

      if (index === -1) {
        newData.unshift(newRow);
        setData((prevData: any) => ({
          ...prevData,
          data: transform ? transform(newData) : newData,
          total: prevData.total + 1,
        }));
      } else {
        newData[index] = { ...newData[index], ...newRow };
        setData((prevData: any) => ({
          ...prevData,
          data: transform ? transform(newData) : newData,
        }));
      }
    },
    [data.data, transform],
  );

  const rowDelete = useCallback(
    (id: number) => {
      if (data.data.length === 0) return;
      let newData = [...data.data];
      newData = newData.filter((r: any) => r.id !== id);
      setData((prevData: any) => ({
        ...prevData,
        data: transform ? transform(newData) : newData,
        total: prevData.total - 1,
      }));
    },
    [data.data, transform],
  );

  return [data, execDB, nextPage, rowUpdate, rowDelete];
}
