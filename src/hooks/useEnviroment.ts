import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Profiles from 'core/enums/Profiles';

export enum EnviromentType {
  DEVELOP = 'Develop',
  PRODUCTION = 'Production',
  COMMUNITY = 'Community',
  NATIVE = 'Native',
}

export default function useEnviroment() {
  const { host } = window.location;
  const { account } = useSelector((state: any) => state.auth);

  const isHostDevelop = useMemo(() => {
    return (
      host.match(/(localhost|develop\.fracttal\.com):?\d*/) !== null ||
      host.match(/^\d+-\d+-\d+-dev-\d+\.dev\.fracttal\.com(\/.*)?$/) !== null
    );
  }, [host]);

  const isDevelop = isHostDevelop;
  const isProd = !isHostDevelop;
  const isCommunity = account.id_profile === Profiles.COMMUNITY;

  const enviroment = useMemo(() => {
    if (isDevelop) {
      return EnviromentType.DEVELOP;
    }
    if (isProd) {
      return EnviromentType.PRODUCTION;
    }
    if (isCommunity) {
      return EnviromentType.COMMUNITY;
    }
    return EnviromentType.NATIVE;
  }, [isCommunity, isDevelop, isProd]);

  return {
    isDevelop,
    isProd,
    isCommunity,
    enviroment,
  };
}
