import React from 'react';

import classes from './WorkInProgress.module.scss';

export const WorkInProgress = ({ children }) => (
  <>
    <div className={classes.icon}>
      <i className="fa fa-exclamation-triangle" />
    </div>
    {children && <div className={classes.content}>{children}</div>}
  </>
);

WorkInProgress.defaultProps = {
  children: null,
};

export default WorkInProgress;
