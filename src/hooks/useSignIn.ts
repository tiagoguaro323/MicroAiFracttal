import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import { getBase64Image, signImage } from 'core/helpers/StorageUtil';
import { authUpdate } from 'store/auth/action';
import JWT from 'core/services/JWT';

const useSignIn = () => {
  const dispatch = useDispatch();

  const setSessionInfo = useCallback(
    (data) => {
      if (
        data &&
        data.company &&
        data.company.path_image &&
        !data.company.path_image.includes('background-img')
      ) {
        signImage(data.company.path_image).then((image) => {
          return getBase64Image(image).then((image64) => {
            dispatch(
              authUpdate({
                ...data,
                password: '', // CUIDADO NO GUARDAR EL PASSWORD
                company: {
                  ...data.company,
                  path_image: image64,
                },
                account: {
                  ...data.account,
                  associated_link: true,
                },
              }),
            );
          });
        });
      }
      JWT.setToken(data.token);
      dispatch(authUpdate(data));
      dispatch(push('/'));
    },
    [dispatch],
  );

  return setSessionInfo;
};

export default useSignIn;
