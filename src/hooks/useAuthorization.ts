import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function useAuthorization(module: number[]) {
  const permissions: any[] = useSelector(
    (state: any) => state.auth.permissions,
  );

  return useMemo(() => {
    const authorization = {
      view: false,
      add: false,
      remove: false,
      edit: false,
      reports: false,
    };
    const permission = Array.isArray(permissions)
      ? permissions.filter(
          (p) => p.id_module === module[0] && p.id_sub_module === module[1],
        )
      : [];
    if (permission.length > 0) {
      return permission[0];
    }
    return authorization;
  }, [module, permissions]);
}
