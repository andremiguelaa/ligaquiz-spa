import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useStateValue } from 'state/State';
import Loading from 'utils/Loading';

export default props => {
  const [state, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = Cookies.get('BEARER-TOKEN');
    if (token) {
      window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.patch('/api/session').then(({ data: { data } }) => {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        const validity = Math.round(
          (Date.parse(data.expires_at) - Date.now()) / 1000 / 60 / 60 / 24 / 2
        );
        Cookies.set('BEARER-TOKEN', data.access_token, { expires: validity });
        dispatch({
          type: 'user.login',
          payload: data.user
        });
        setLoading(false);
      });
      // TODO: when fails
    } else {
      setLoading(false);
    }
  }, []);
  return <>{!loading ? props.children : <Loading />}</>;
};
