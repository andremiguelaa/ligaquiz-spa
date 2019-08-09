import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';

export default props => {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  const { title, ...rest } = props;
  return <Route {...rest} />;
};
