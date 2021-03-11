import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import { useStateValue } from 'state/State';
import Loading from 'components/Loading';
import ApiRequest, { setBearerToken } from 'utils/ApiRequest';

export const setLoginData = (data, dispatch) => {
  if (data.access_token) {
    const validity = Math.round(
      (Date.parse(data.expires_at.replace(/ /g, 'T')) - Date.now()) /
        1000 /
        60 /
        60 /
        24 /
        2
    );
    Cookies.set('AUTH-TOKEN', data.access_token, {
      expires: validity,
      sameSite: 'strict',
    });
    setBearerToken(data.access_token);
  }
  if (dispatch) {
    dispatch({
      type: 'user.login',
      payload: data.user,
    });
  }
};

const Auth = (props) => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = Cookies.get('AUTH-TOKEN');
    if (token) {
      ApiRequest.patch('session')
        .then(({ data }) => {
          const validity = Math.round(
            (Date.parse(data.expires_at.replace(/ /g, 'T')) - Date.now()) /
              1000 /
              60 /
              60 /
              24 /
              2
          );
          Cookies.set('AUTH-TOKEN', token, {
            expires: validity,
            sameSite: 'strict',
          });
          setLoginData(data, dispatch);
        })
        .catch(({ response }) => {
          if (response?.status === 401) {
            Cookies.remove('AUTH-TOKEN');
          }
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

export default Auth;
