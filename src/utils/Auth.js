import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import Loading from 'components/Loading';
import ApiRequest, { setBearerToken } from 'utils/ApiRequest';

export const setLoginData = (data, dispatch) => {
  if (data.access_token) {
    const validity = Math.round(
      (Date.parse(data.expires_at) - Date.now()) / 1000 / 60 / 60 / 24 / 2
    );
    Cookies.set('BEARER-TOKEN', data.access_token, { expires: validity });
    setBearerToken(data.access_token);
  }
  dispatch({
    type: 'user.login',
    payload: data.user
  });
};

export default props => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = Cookies.get('BEARER-TOKEN');
    if (token) {
      ApiRequest.patch('session')
        .then(({ data: { data } }) => {
          setLoginData(data, dispatch);
        })
        .catch(() => {
          toast.error(<Trans>A tua sessão expirou.</Trans>, {
            hideProgressBar: true,
            closeButton: false
          });
          Cookies.remove('BEARER-TOKEN');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch, setLoading]);
  return <>{!loading ? props.children : <Loading type="full" />}</>;
};
