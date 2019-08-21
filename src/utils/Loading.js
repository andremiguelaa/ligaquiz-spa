import React from 'react';

import classes from './Loading.module.scss';

export const Loading = ({ type }) => (
  <div className={classes[type]}>
    <i className="fa fa-cog fa-spin" />
  </div>
);

Loading.defaultProps = {
  type: 'block'
};

export default Loading;
