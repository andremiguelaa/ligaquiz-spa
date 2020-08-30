import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Forbidden from './Forbidden';

const Logout = () => {
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (user) {
      ApiRequest.delete('session').finally(() => {
        Cookies.remove('AUTH-TOKEN');
        dispatch({
          type: 'user.logout',
        });
        history.push('/');
        window.location.reload();
      });
    }
  });

  if (!user) {
    return <Forbidden />;
  }

  return <Loading type="full" />;
};

export default Logout;
