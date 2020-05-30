import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Forbidden from './Forbidden';

const Logout = ({ history }) => {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (user) {
      ApiRequest.delete('session').finally(() => {
        Cookies.remove('BEARER-TOKEN');
        dispatch({
          type: 'user.logout'
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
