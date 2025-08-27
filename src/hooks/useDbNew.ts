import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import DB from 'core/services/DB';
import { mainError } from 'store/main/actions';
import i18n from 'i18n';
import { IRpc } from 'core/services/RequestRpc';
import { reset } from 'store';

export default function useDbNew({
  fnc = '',
  init = {},
  autoExec = false,
  transform = (params: any[]) => params,
  showErrorMsg = true,
  disabledBatch = true,
}): [
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
  () => void,
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
    limit: 100,
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
      const newParams = {
        page: params.page,
        limit: params.limit,
        start: params.start,
        append: params.append,
        ...init,
        ...extraParams,
      };
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
        ({ result }: IRpc) => {
          let newData = result && result.data ? result.data : [];
          newData = Array.isArray(newData) ? newData : [newData];
          newData = transform ? transform(newData) : newData;
          const append = newParams.page > 1 && newParams.append;

          if (result && result.success) {
            setParams(newParams);
            setData((currentData) => ({
              loading: false,
              success: result.success,
              message: result.message,
              total: result.total,
              data: append ? [...currentData.data].concat(newData) : newData,
              isExec: true,
              currentPage: newParams.page,
            }));
          } else if (result) {
            setParams({
              page: 1,
              limit: 50,
              start: 0,
              append: true,
              ...init,
            });
            if (result.message === 'USER_NOT_LOGIN') {
              dispatch(reset());
              dispatch(push('/signin'));
            } else if (showErrorMsg) {
              dispatch(mainError({ msg: i18n.t(result.message) }));
            }
            setData({
              loading: false,
              success: false,
              message: result?.message || '',
              total: result?.total || 0,
              data: append ? [...data.data].concat(newData) : newData,
              isExec: true,
              currentPage: 1,
            });
          }
        },
        disabledBatch,
      );
    },
    [
      params,
      fnc,
      disabledBatch,
      transform,
      data.data,
      init,
      showErrorMsg,
      dispatch,
    ],
  );

  const nextPage = useCallback(
    (filter?: any[]) => {
      execDB({ ...params, page: params.page + 1, filter });
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

  const clear = useCallback(() => {
    setData((prevData: any) => ({
      ...prevData,
      data: [],
    }));
    setParams({
      page: 1,
      limit: 50,
      start: 0,
      append: true,
      ...init,
    });
  }, [init]);

  return [data, execDB, nextPage, rowUpdate, rowDelete, clear];
}
