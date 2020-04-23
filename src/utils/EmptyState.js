import React from 'react';

import classes from './EmptyState.module.scss';

export const EmptyState = ({ children }) => (
  <>
    <div className={classes.icon}>
      <i className="fa fa-meh-o" />
    </div>
    <div className={classes.content}>
        {children}
    </div>
  </>
);

EmptyState.defaultProps = {
  children: null,
};

export default EmptyState;
