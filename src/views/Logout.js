import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';

const Logout = () => {
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (user) {
      Cookies.remove('AUTH-TOKEN');
      dispatch({
        type: 'user.logout',
      });
      history.push('/');
      ApiRequest.delete('session');
    }
  });

  if (!user) {
    return <Error status={403} />;
  }

  return <Loading type="full" />;
};

export default Logout;
