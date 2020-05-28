import React from 'react';

import classes from './EmptyState.module.scss';

const EmptyState = ({ children }) => (
  <>
    <div className={classes.icon}>
      <i className="fa fa-meh-o" />
    </div>
    {children && <div className={classes.content}>{children}</div>}
  </>
);

EmptyState.defaultProps = {
  children: null,
};

export default EmptyState;
