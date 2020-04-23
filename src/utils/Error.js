import React from 'react';

import classes from './Error.module.scss';

export const Error = ({ children }) => (
  <>
    <div className={classes.icon}>
      <i className="fa fa-bomb" />
    </div>
    <div className={classes.content}>
        {children}
    </div>
  </>
);

Error.defaultProps = {
  children: null,
};

export default Error;
