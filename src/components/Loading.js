import React from 'react';

import classes from './Loading.module.scss';

const Loading = ({ type }) => (
  <div className={classes[type]}>
    <i className="fa fa-spinner fa-spin" />
  </div>
);

Loading.defaultProps = {
  type: 'block'
};

export default Loading;
