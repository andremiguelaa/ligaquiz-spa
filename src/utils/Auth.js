import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import Loading from 'components/Loading';
import Error from 'components/Error';
import ApiRequest, { setBearerToken } from 'utils/ApiRequest';

export const setLoginData = (data, dispatch) => {
  if (data.access_token) {
    const validity = Math.round(
      (Date.parse(data.expires_at) - Date.now()) / 1000 / 60 / 60 / 24 / 2
    );
    Cookies.set('AUTH-TOKEN', data.access_token, { expires: validity });
    setBearerToken(data.access_token);
  }
  dispatch({
    type: 'user.login',
    payload: data.user,
  });
};

export default (props) => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
    const token = Cookies.get('AUTH-TOKEN');
    if (token) {
      ApiRequest.patch('session')
        .then(({ data }) => {
          setLoginData(data, dispatch);
          setLoading(false);
        })
        .catch(({ response }) => {
          if (response?.status === 401) {
            toast.error(<Trans>A tua sessão expirou.</Trans>, {
              hideProgressBar: true,
              closeButton: false,
            });
            Cookies.remove('AUTH-TOKEN');
            setLoading(false);
          } else {
            setError(true);
          }
        });
    } else {
      setLoading(false);
    }
  }, [dispatch, setLoading]);
  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }
  return <>{!loading ? props.children : <Loading type="full" />}</>;
};
