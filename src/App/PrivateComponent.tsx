import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import JWT from 'core/services/JWT';
import Profiles from 'core/enums/Profiles';

const PrivateComponent: FC<{ children: any }> = ({ children }) => {
  const isSignIn = JWT.loggedIn();
  const account = useSelector((state: any) => state.auth.account);
  const location = useLocation();

  const oauthRedirect =
    new URLSearchParams(location.search).get('oauthredirect') || null;

  if (
    ['/accessgrant', '/signin'].includes(location.pathname) &&
    oauthRedirect
  ) {
    if (isSignIn && account.id_profile === Profiles.ADMINISTRATOR) {
      return children;
    }

    return (
      <Navigate
        to={`/signin?oauthredirect=${oauthRedirect}`}
        state={{
          withoutAccess:
            isSignIn &&
            account.id_profile &&
            account.id_profile !== Profiles.ADMINISTRATOR,
        }}
      />
    );
  }

  if (isSignIn) return children;

  return <Navigate to="/signin" />;
};

export default PrivateComponent;
