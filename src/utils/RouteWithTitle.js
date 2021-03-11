import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';

const RouteWithTitle = (props) => {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  const { title, ...rest } = props;
  return <Route {...rest} />;
};

export default RouteWithTitle;
